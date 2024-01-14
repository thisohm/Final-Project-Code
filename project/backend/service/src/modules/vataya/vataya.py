import grpc
import wave
import base64
import json
import src.modules.vataya.vataya_pb2 as vataya_pb2
import src.modules.vataya.vataya_pb2_grpc as vataya_pb2_grpc

from configparser import ConfigParser
config = ConfigParser()
config.read('./src/configs/config.ini')


class Vataya():
    """
    Client for gRPC functionality
    """

    def __init__(self, host, port, apikey, clientid):
        self.host = host
        self.server_port = port
        self.apikey = apikey
        self.clientid = clientid

        # instantiate a channel
        self.channel = grpc.insecure_channel(
            '{}:{}'.format(self.host, self.server_port))
        # bind the client and the server
        self.stub = vataya_pb2_grpc.VatayaServiceStub(channel=self.channel)

    def connect(self):
        cinfo = vataya_pb2.ClientInfo(apikey=self.apikey,
                                      clientid=self.clientid,
                                      sampling=vataya_pb2.Sampling.WB,
                                      texttransform=vataya_pb2.TextTransform.LineSegment)
        res = self.stub.Connect(cinfo)
        if res.status == 200:
            return True
        else:
            return False

    def recognize(self, data_list):
        responses = self.stub.Recognize(data_list)
        message = self.listen(responses)
        return message

    def listen(self, responses):
        DEBUG(responses)
        output = []
        for r in responses:
            DEBUG(r.transcription)
            obj = json.loads(r.transcription)
            if obj['l'] == "-1":
                # print("patial :", obj['r'])
                DEBUG("")
            else:
                # print("result :", obj['r'])
                output.append(obj)

        return output

    def readwave(self, fname):
        audio = wave.open(fname, 'r')
        # print("Number of channels", audio.getnchannels())
        # print("Sample width", audio.getsampwidth())
        print("Frame rate.", audio.getframerate())
        # print("Number of frames", audio.getnframes())
        # print("parameters:", audio.getparams())

        length = audio.getnframes()
        readed = 0
        chunk = 1024
        for i in range(0, length, chunk):
            wavedata = audio.readframes(chunk)
            # print("readed = ", readed)
            yield vataya_pb2.AudioData(content=base64.b64encode(wavedata))
            readed += chunk
            # check last chunk
            if (length - readed) < chunk:
                chunk = length - readed

        audio.close()


def DEBUG(msg):
    if (config['DEBUG']['debug'] == 'true'):
        print("DEBUG::", msg)
