# 
# Author: Kasidich Kiettivut
#
# Create: 01 Dec 2022
# 
# Copyright @2022 Ai9 Co., Ltd.. All Rights Reserved
# 
# Source Code License. Subject to the terms and conditions of this Platform,
# if You separately acquire a Source Code License, You are licensed to use
# the Source Code. A separate independent Source Code License is also required
# for each affiliate or subsidiary using the SOFTWARE. You are hereby granted
# a license to use the Source Code solely for the purposes based upon your
# purchased option.
# The Source Code may not routinely be delivered with all versions of the SOFTWARE.
# The following limitations to your Source Code License shall apply:
# 
import logging
from socket import SocketIO
from urllib import request
import socketio
from configparser import ConfigParser

# standard Python
sio = socketio.Client(reconnection=True)

# ============ Server Function ============

config = ConfigParser()
config.read('./src/configs/config.ini')
sio_server = config['tasana']['sio_server']
sio_path = config['tasana']['sio_path'] + "socket.io"
room = ''

@sio.event
def connect():
    print("Connected ID:", sio.sid)

@sio.event
def connect_error(data):
    print(data)

@sio.event
def disconnect():
    sio.eio.disconnect(True)
    print("Disconnected ID: ", sio.sid)

@sio.on('join_room')
def socketJoin(videoId): 
    room = videoId
    sio.emit('join_room: ', { 
        'room': videoId, 
        'sio_id': sio.sid
    })
    print("Client room: ", room)

@sio.on('send_message')
def statusMessage(videoId, message): 
    sio.emit('send_message', 
    { 
        'room': videoId, 
        'video_id': videoId, 
        'message': message
    })

# @sio.on('updateVideoStatusService')
# def on_message(data):
#     return 
#     print("Recieve saving work!")

# @sio.event
# def message(data):
#     return
#     print('I received a message!')

# ============ Main Function ============
def connectSocket():
    try:
        sio.connect(sio_server, socketio_path=sio_path)
    except:
        print(">>> error while connecting to socket")
