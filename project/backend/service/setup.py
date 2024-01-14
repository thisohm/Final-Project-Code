# general library
import os
import sys
import signal
import pathlib
from posixpath import dirname
from threading import Thread, Semaphore
from time import sleep, gmtime, strftime
#from progress.bar import Bar
#from tqdm.auto import tqdm

# other file
from socketIO import *
from src.call_api import *
from src.closed_caption import *
from src.helpers.ffmpeg import *
from src.modules.vataya.vataya import *


number_of_computers = 1
number_of_using = 1

semaphore = Semaphore(number_of_computers)


def current_time():
    return strftime("%H:%M:%S", gmtime())


def signal_handler(signal, frame):
    print("exiting")
    sys.exit(0)


class TASANA(Thread):

    def __init__(self, thread_id):
        Thread.__init__(self)
        self.thread_id = thread_id
        self.basedir = os.path.dirname(os.path.realpath(__file__))

    def run(self):
        try:
        #     while True:
        #         print('------------- while -------------')
            # semaphore.acquire()
            self.transcribing_video()
        #         print("%s started using a computer [%s]" % (self.thread_id, current_time()))
        #         sleep(5)
        #         print("%s finished using a computer [%s]" % (self.thread_id, current_time()))
            # semaphore.release()

        except:
            print("Error: unable to start thread")


    # def process_data(thread_name, q):
    #     while running:
    #         queue_lock.acquire()
    #         if not work_queue.empty():
    #             data = q.get()
    #             queue_lock.release()
    #             print( thread_name+" processing "+data)
    #         else:
    #             queue_lock.release()
    #             sleep(1)

    def transcribing_video(self):
        #connectSocket()
        while True:
            try:
                # Get video to Transcibing by videoStauts= "Waiting in queue"
                lsVideo = getVideoByStatus("1")                 # res => key: value => videoId: path
                #print('test') #NoneType

                if (len(lsVideo) == 0):
                    print("[%s] >> thread_id: %s >> No video to convert" % (current_time(), str(self.thread_id)))

                if lsVideo and (len(lsVideo) > 0):
                    #with Bar('Processing...') as bar:
                        for videoId in lsVideo:
                            # ? user connected
                            connectSocket()
                            socketJoin(videoId)
                            #print(videoId)
                            
                            # ? Update Status & Socket to Transcribing
                            updateStatus(videoId, "2")
                            #update event ?
                            statusMessage(videoId, "Transcribing")
                            #socketOnSuccess(videoId, "Transcribing")

                            # ? Get video from Directory
                            change_dir = os.path.join("TASANA-SM", "Tasana-Service")
                            dirPathVideo = os.path.join(self.basedir, lsVideo[videoId])             # /Users/macbook/Development/iWork/AI9/Platform/TASANA/TASANA-SM/Tasana-Service/uploads/videos/......
                            dirPathVideo = dirPathVideo.replace(change_dir, "TASANA-APIM")          # /Users/macbook/Development/iWork/AI9/Platform/TASANA/TASANA-APIM/uploads/videos/......
                            # get file extension
                            ext = pathlib.Path(dirPathVideo).suffix
                            
                            # ? get directory to using
                            closed_caption_file = ClosedCaptionFile(dirPathVideo)
                            path_image = closed_caption_file.convert_directory_db('image', ext)
                            path_audio = closed_caption_file.convert_directory_db('audio', ext)
                            path_subtitle_vtt = closed_caption_file.convert_directory_db('subtitle.vtt', ext)
                            path_subtitle_srt = closed_caption_file.convert_directory_db('subtitle.srt', ext)
                            
                            # ? get directory to database
                            dir_for_db = ClosedCaptionFile(lsVideo[videoId])
                            dir_for_db_image = dir_for_db.convert_directory_db('image', ext)
                            dir_for_db_audio = dir_for_db.convert_directory_db('audio', ext)
        
                            # ? SCENCE DETECT
                            # createScenceDetect(videoPathVideoFormatted)
                            # ? Convert MP4 --> wav & jpg
                            ffmpeg_command = FfmpegCommand(dirPathVideo)
                            # set cover
                            if ext == '.mp4' or ext == '.wmv' or ext == '.mov':
                                ffmpeg_command.generateToJPG(path_image)
                            else:
                                os.system('cp -f template/audio-cover.jpg ' + path_image)
                            ffmpeg_command.generateToWav(path_audio)
                            print("============= Convert File SUCESSFUL! ==============")

                            # ? Call VATAYA and Transcibe to database
                            try:
                                vataya = Vataya(config['vataya']['server'], config['vataya']['port'],
                                                config['vataya']['apikey'], config['vataya']['clientid'])
                                if not vataya.connect():
                                    print("Connection failed")
                                    sys.exit(1)
                                rawbyte_list = vataya.readwave(path_audio)
                                message = vataya.recognize(rawbyte_list)
                                # print("This is rawbyte_list ==>", rawbyte_list)
                                # print("This is a message ==>", message)

                                lsContent = []
                                for output in message:
                                    #DEBUG("debug" + output)
                                    if (output["r"] == ""):
                                        #!Do nothing
                                        print()
                                    else:
                                        #print(output["r"])
                                        #print(output["u"])
                                        contentInfo = {
                                            "sentence": output["r"], 
                                            #"contentSeq": output["u"],
                                            "start": output["b"],
                                            "stop": float(output["b"]) + float(output["l"]),
                                        }
                                        lsContent.append(contentInfo)
                                        #print(contentInfo)
                                        createContent(videoId, contentInfo)

                                closed_caption_file.generate_file_closed_caption(path_subtitle_srt ,lsContent, 'srt')
                                closed_caption_file.generate_file_closed_caption(path_subtitle_vtt ,lsContent, 'vtt')

                                # ? Put path file Image, Audio and Subtitle to database
                                updateImagePath(videoId, dir_for_db_image)
                                updateAudioPath(videoId, dir_for_db_audio)
                                updatePathSubtitle(videoId, path_subtitle_vtt)

                                # ? Update Status & Socket to "Finished"
                                updateStatus(videoId, "3")
                                statusMessage(videoId, "Finished")

                                print("=========Transcribe SUCESSFUL!===========")
                                #bar.next()
                                disconnect()

                            except Exception as error:
                                print("ERROR1::", type(error), " --> ", error)
                                print("ERROR2:: VATAYA cannot 'Transcribing'")

            except Exception as error:
                # print(error)
                print("ERROR::", type(error), " --> ", error)
                print("Connection refused by the server..")
                print("Let me sleep for 5 seconds")
                print("ZZzzzz...")
                # time.sleep(5)
                sleep(5)      # sleep 5 seconds
                print("Was a nice sleep, now let me continue...")
                print()
                continue
            sleep(5)
            print()


if __name__ == '__main__':

    signal.signal(signal.SIGINT, signal_handler)

    threads_arr = []

    for i in range(1, number_of_using + 1):
        t = TASANA(i)
        threads_arr.append(t)
        t.daemon = True             # die when the main thread dies
        t.start()

    for thr in threads_arr:         # let them all start before joining
        thr.join()