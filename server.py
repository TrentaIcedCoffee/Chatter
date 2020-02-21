''' backend '''

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from dotenv import load_dotenv
import six
import os

punctuations = set('''!()-[]{};:'"\,<>./?@#$%^&*_~''')

def checkEnv(reqVars):
  missings = []
  for var in reqVars:
    if var not in os.environ:
      missings.append(var)
  if missings:
    exit(f'missing vars: {",".join(missings)}')

app = Flask(__name__)

# config
load_dotenv('./.envs/.env')
reqVars = ['GOOGLE_APPLICATION_CREDENTIALS']
checkEnv(reqVars)
CORS(app)

# routes
@app.route('/', methods=['GET'])
def index():
  ''' health check '''
  return {'message': 'ok'}, 200

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
    emit('err', ','.join(errors))
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
  emit('err', {'err': err})

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
  if not isValidParam(data, [('email',str),('pkg',dict)]):
    return
  emit('msg', {
    'email': data['email'],
    'pkg': data['pkg'],
  }, broadcast=True, include_self=True)

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=3000, debug=True)
