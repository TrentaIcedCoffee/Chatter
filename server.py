''' backend '''

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
CORS(app)

# routes
@app.route('/', methods=['GET'])
def index():
  ''' health check '''
  return {'message': 'ok'}, 200

# sockets
activeUsers = set() # { email... }

socketio = SocketIO(app, cors_allowed_origins='*')

def emitActiveUsers():
  emit('activeUsers', {'activeUsers': list(activeUsers)}, broadcast=True, include_self=True)

@socketio.on('connect')
def connect():
  ''' new connect '''
  emitActiveUsers()

@socketio.on('addUser')
def addUser(data):
  activeUsers.add(data['user'])
  emitActiveUsers()

@socketio.on('rmUser')
def rmUser(data):
  activeUsers.remove(data['user'])
  emitActiveUsers()

@socketio.on('msg')
def msg(data):
  email, text = data['user'], data['text']
  # TODO add to text collections
  emit('msg', { 'user': email, 'text': text }, broadcast=True, include_self=True)

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=3000)
