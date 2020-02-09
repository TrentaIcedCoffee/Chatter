''' backend '''

from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.secret_key = os.urandom(24)

db = SQLAlchemy(app)

class User(db.Model):
  __tablename__ = 'users'
  userId = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String, nullable=False)
  password = db.Column(db.String, nullable=False)

@app.route('/', methods=['GET'])
def ping():
  ''' health check '''
  return 'pong'

@app.route('/register', methods=['POST'])
def register():
  ''' create new user and create session '''
  username = request.form.get('username').lower()
  password = request.form.get('password').lower()
  if User.query.filter_by(username=username).count() > 0:
    return {'message': 'username exists'}, 400
  newUser = User(username=username, password=password)
  db.session.add(newUser)
  db.session.commit()
  updateSession(newUser)
  return {'message': 'ok'}, 200

@app.route('/login', methods=['POST'])
def login():
  ''' login and create session '''
  username = request.form.get('username').lower()
  password = request.form.get('password').lower()
  user = User.query.filter_by(username=username).first()
  if user is None or user.password != password:
    return {'message': 'username/password mismatch'}, 400
  updateSession(user)
  return {'message': 'ok'}, 200

def updateSession(user):
  session['userId'] = user.userId
  session['username'] = user.username

socketio = SocketIO(app)

@socketio.on('connectEvent')
def connect():
  emit('status', {'message': 'connected'})

if __name__ == '__main__':
  socketio.run(app, host='localhost')
