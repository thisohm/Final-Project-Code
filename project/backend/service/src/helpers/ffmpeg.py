import os


class FfmpegCommand:

    def __init__(self, path_input):
        self.path_input = path_input

    def generateToWav(self, path_output):
        os.system(
            'ffmpeg -y -i {} -vn -acodec pcm_s16le -ar 16000 -ac 1 {} -hide_banner -loglevel error '
            .format(self.path_input, path_output)
        )


    def generateToJPG(self, path_output):
        os.system(
            'ffmpeg -y -ss 00:00:00 -i {} -vframes 1 -q:v 2 -s 720:404 {} -hide_banner -loglevel error '
            .format(self.path_input, path_output)
        )
