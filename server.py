''' backend '''

from flask import Flask
from flask_acsecure import ACSecure
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)

# config
load_dotenv()
app.debug = True
app.config.update({
  'ACSECURE_APP_ID': os.environ.get('ACSECURE_APP_ID'),
  'ACSECURE_APP_TOKEN': os.environ.get('ACSECURE_APP_TOKEN'),
})
CORS(app)
# ACSecure(app)

# error handlers
@app.errorhandler(403)
def forbidden(e):
  return { 'message': 'forbidden' }

@app.errorhandler(400)
def badRequest(e):
  print(e)
  return { 'message': 'bad request' }

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

activeUsers = set() # { email: str... }

socketio = SocketIO(app, cors_allowed_origins='*')

def emitActiveUsers():
  emit(
    'activeUsers', {'emails': list(activeUsers)},
    broadcast=True, include_self=True
  )

@socketio.on('connect')
def connect():
  ''' new connect '''
  emitActiveUsers()

@socketio.on('addUser')
def addUser(data):
  if contains(data, 'email'):
    activeUsers.add(data['email'])
    emitActiveUsers()

@socketio.on('rmUser')
def rmUser(data):
  if contains(data, 'email'):
    if data['email'] in activeUsers:
      activeUsers.remove(data['email'])
    emitActiveUsers()

@socketio.on('msg')
def msg(data):
  if contains(data, 'email,text'):
    email, text = data['email'], data['text']
    # TODO add to text collections
    emit('msg', {
      'email': email,
      'text': text,
    }, broadcast=True, include_self=True)

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=3000)
