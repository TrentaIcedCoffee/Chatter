from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import math
import six
import os

checkEnv = lambda reqVars: [var for var in reqVars if var not in os.environ]

class ConfigError(Exception):
  pass

class NLPUtils:

  punctuations = set('''!()-[]{};:'"\,<>./?@#$%^&*_~''')

  def __init__(self):
    if 'GOOGLE_APPLICATION_CREDENTIALS' not in os.environ:
      raise ConfigError('GOOGLE_APPLICATION_CREDENTIALS not in environ')
    elif 'NAMES' not in os.environ:
      raise ConfigError('NAMES not in environ')
    names = os.environ.get('NAMES').split(',')
    self.base = {name: 0 for name in names}
    self.names = set(names)
    self.client = language.LanguageServiceClient()

  def processName(self, name):
    lst = name.split('/')
    if len(lst) > 1 and lst[1] in self.names:
      return lst[1]
    return None

  def processText(self, text):
    textDropped = ''.join(map(
      lambda c: c if c not in NLPUtils.punctuations else ' ',
      text
    ))
    wordLst = list(filter(lambda c: c, textDropped.split(' ')))
    if wordLst:
      wordLst *= math.ceil(40 / len(wordLst))
      return ' '.join(wordLst)
    return None

  def compute(self, text):
    try:
      if isinstance(text, six.binary_type):
        text = text.decode('utf-8')
      document = types.Document(
        content=text.encode('utf-8'),
        type=enums.Document.Type.PLAIN_TEXT
      )
      categories = self.client.classify_text(document).categories
      return categories if categories else None
    except Exception as e:
      print(e)
    return None

  def train(self, text):
    textProcessed = self.processText(text)
    if textProcessed:
      categories = self.compute(textProcessed)
      if categories:
        res = self.base.copy()
        for category in categories:
          name = self.processName(category.name)
          if name:
            res[name] = category.confidence
        return res
    return None

class DbUtils:
  def __init__(self):
    if 'GOOGLE_APPLICATION_CREDENTIALS' not in os.environ:
      raise ConfigError('GOOGLE_APPLICATION_CREDENTIALS not in environ')
    cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
    firebase_admin.initialize_app(cred)
    self.admin = firebase_admin
    self.db = firestore.client()

  def ingest(self, email, res):
    docRef = self.db.document(f'users/{email}')
    prev = docRef.get().to_dict()
    if not prev or 'profile' not in prev or 'ingestCnt' not in prev:
      ingestCnt, profile = 1, res
    else:
      ingestCnt = prev['ingestCnt'] + 1
      profile = {
        name: sum([
          prev['profile'][name] * (prev['ingestCnt'] / ingestCnt),
          res[name] * (1 / ingestCnt),
        ])
        for name in prev['profile']
      }
    docRef.set({
      'ingestCnt': ingestCnt,
      'profile': profile,
    })