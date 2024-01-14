# import imageio
# from scenedetect_video import find_scenes
# from imageio_gif import dir_image, imageio_create
# import scenedetect
# from scenedetect import VideoManager
# from scenedetect import FrameTimecode


class ClosedCaptionFormat:

    def __init__(self, start, stop):
        self.start = start
        self.stop = stop


    def convert_sec_to_time_vtt(self, value):
        seconds = float(value) % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        millisec = seconds // 0.001
        millisec %= 1000
        return "%d:%02d:%02d.%03d" % (hour, minutes, seconds, millisec)


    def convert_sec_to_time_srt(self, value):
        seconds = float(value) % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        millisec = seconds // 0.001
        millisec %= 1000
        return "%d:%02d:%02d,%03d" % (hour, minutes, seconds, millisec)


    def time_format_vtt(self):
        return self.convert_sec_to_time_vtt(self.start) + " --> " + self.convert_sec_to_time_vtt(self.stop)


    def time_format_srt(self):
        return self.convert_sec_to_time_srt(self.start) + " --> " + self.convert_sec_to_time_srt(self.stop)



class ClosedCaptionFile:
    
    def __init__(self, path):
        self.path = path


    def clear_file_closed_caption(self):
        fileVariable = open(self.path, 'r+')
        fileVariable.truncate(0)
        fileVariable.close()
        return "Clear File Sucessful!"


    def generate_file_closed_caption(self, path_output, contentInfo, type):
        f = open(path_output, 'a+', encoding="utf-8")
        f.truncate(0)
        index = 0

        for content in contentInfo:
            index += 1
            if((type).lower() == 'vtt'):
                if(index == 1):
                    f.write("WEBVTT FILE\n")
                    f.write("\n")
                line = str(index+1) + "\n" + ClosedCaptionFormat(content['start'], content['stop']).time_format_vtt() + "\n" + content['sentence'] + "\n\n"
                f.write(line)
            
            if((type).lower() == 'srt'):
                line = str(index+1) + "\n" + ClosedCaptionFormat(content['start'], content['stop']).time_format_srt() + "\n" + content['sentence'] + "\n\n"
                f.write(line)
    
        f.close()

        return "Generate File Sucessful!"


    def convert_directory_db(self, type, ext):
        # dirname = os.path.dirname(videoPath)
        # basename = os.path.basename(videoPath)
        # file_name_video = os.path.splitext(basename)[0]
        if((type).lower() == 'image'):
            return self.path.replace("-orig" + ext, "-image.jpg")

        if((type).lower() == 'audio'):
            return self.path.replace("-orig" + ext, "-audio.wav")

        if((type).lower() == 'subtitle.vtt'):
            #vtt = self.path.replace("/app", "")
            return self.path.replace("-orig" + ext, "-subtitle.vtt")

        if((type).lower() == 'subtitle.srt'):
            return self.path.replace("-orig" + ext, "-subtitle.srt")

        return


# def createScenceDetect(videoPathVideo):
#     dirname = os.path.dirname(videoPathVideo)
#     video_manager = VideoManager([videoPathVideo])
#     x = FrameTimecode(timecode="00:20:00.000", fps=10.0)
#     scene_list = find_scenes(videoPathVideo, x)
#     output_dir = dirname

#     scenedetection = scenedetect.scene_manager.save_images(scene_list, video_manager, num_images=3, frame_margin=1, image_extension='jpg', encoder_param=95,
#                                                            image_name_template='$VIDEO_NAME-Scene-$SCENE_NUMBER-$IMAGE_NUMBER', output_dir=output_dir, downscale_factor=1, show_progress=False)

#     image_folder = os.fsencode(output_dir)
#     filenames = dir_image(image_folder)
#     imageio_create(output_dir, filenames, 'movie.gif')

#     return scenedetection, imageio_create