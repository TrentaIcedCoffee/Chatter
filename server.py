''' backend '''

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from dotenv import load_dotenv

import os

load_dotenv()
envs = [

]
if envs and any(os.getenv(env) is None for env in envs):
  exit('exited for missing envs')

app = Flask(__name__)
app.debug = True
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app)

# routes
@app.route('/', methods=['GET'])
def index():
  ''' health check '''
  return {'message': 'ok'}, 200

# sockets
activeUsers = set()

socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('connect')
def connect():
  ''' new connect '''
  print('new connection done')

@socketio.on('pushUser')
def pushUser(data):
  activeUsers.add(data['email'])
  emit('users', {'users': list(activeUsers)})
  print(activeUsers)

@socketio.on('popUser')
def popUser(data):
  activeUsers.remove(data['email'])
  emit('users', {'users': list(activeUsers)})
  print(activeUsers)

@socketio.on('call')
def call(data):
  room = data['room']
  this, that = room.split(':')
  print(this, 'calls', that)
  join_room(room)
  emit(that, { 'this': this })

@socketio.on('answer')
def answer(data):
  username = data['username']
  room = data['room']
  that, this = room.split(':')
  print(this, 'answer', that)
  join_room(room)

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=3000)