''' backend '''

from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from dotenv import load_dotenv
import utils

# config
app = Flask(__name__)
load_dotenv('./.envs/.env')
reqVars = ['GOOGLE_APPLICATION_CREDENTIALS', 'NAMES']
utils.checkEnv(reqVars)
CORS(app)
db = utils.DbUtils()
nlp = utils.NLPUtils()

# routes
@app.route('/', methods=['GET'])
def index():
  ''' health check '''
  return {'message': 'ok'}, 200

@app.route('/ingest', methods=['POST'])
def ingest():
  ''' ingest to profile '''
  data = request.get_json(silent=True)
  if 'email' not in data or 'text' not in data:
    return {'message': 'email/text not posted'}, 400
  res = nlp.train(data['text'])
  if not res:
    return {'message': 'useless text'}, 200
  db.ingest(data['email'], res)
  return {'message': 'ingest done'}, 200

# sockets
def contains(d, s):
  if not s:
    return True
  return all(key in d and type(d[key] == str) for key in s.split(','))

def isValidParam(obj, lst):
  errors = []
  for key, _type in lst:
    if key not in obj:
      errors.append(f'missing {key}')
    elif key in obj and type(obj[key]) != _type:
      errors.append(f'{key} not in type {_type}')
  if errors:
    emitError(','.join(errors))
    return False
  return True

activeUsers = set() # { email: str... }

socketio = SocketIO(app, cors_allowed_origins='*')

def emitActiveUsers():
  emit(
    'activeUsers', {'emails': list(activeUsers)},
    broadcast=True, include_self=True
  )

def emitError(err: str):
  emit('err', {'err': err}, broadcast=False)

@socketio.on('connect')
def connect():
  ''' new connect '''
  emitActiveUsers()

@socketio.on('addUser')
def addUser(data):
  if not isValidParam(data, [('email',str)]):
    return
  activeUsers.add(data['email'])
  emitActiveUsers()

@socketio.on('rmUser')
def rmUser(data):
  if not isValidParam(data, [('email',str)]):
    return
  if data['email'] in activeUsers:
    activeUsers.remove(data['email'])
  emitActiveUsers()

@socketio.on('msg')
def msg(data):
  if not isValidParam(data, [('email',str),('pkg',list)]):
    return
  emit('msg', {
    'email': data['email'],
    'pkg': data['pkg'],
  }, broadcast=True, include_self=True)
  email, text = data['email'], data['pkg'][0]['text']
  res = nlp.train(text)
  if res:
    db.ingest(email, res)
  print('ingest done')

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=3000, debug=True)
