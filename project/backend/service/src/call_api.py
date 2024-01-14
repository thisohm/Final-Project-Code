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
from configparser import ConfigParser
import json
from os import error
from tkinter import PROJECTING

from src.configs.api import *
from src.helpers.custom_exceptions import *

config = ConfigParser()
config.read('./src/configs/config.ini')


def getVideoByStatus(status):
    try:
        videoPathDict = {}
        payload = {'video_status': status}
        response = request_post(config['tasana']['api']+'/video/status', payload)
        lsVideo = json.loads(response.text)
        if len(lsVideo["result"]) > 0:
            print(len(lsVideo))
            for video in lsVideo["result"]:
                #print("video = ",video)
                videoId = video["video_id"]
                #print("videoId",videoId)
                videoPathVideo = video["video_path"]
                #print("videoPathVideo", videoPathVideo)
                videoPathDict[videoId] = videoPathVideo        
            return videoPathDict
        else:
            return []

    except (KeyError, TypeError) as error:
        print("ERROR4::", type(error) ," --> " ,error)

    # except requests.exceptions.ConnectionError:
    #     # raise RequestsExceptions
    #     print("OOPS!! Connection Error. GetVideoByStatus Connection refused")
    # except RequestsExceptions: 
    #     print("OOPS!! Connection Error. GetVideoByStatus Connection refused")
        

def updateAudioPath(videoId, videoPathAudio):
    try:
        payload = {'video_id': videoId, 'audio_path': videoPathAudio}
        response = request_post(config['tasana']['api'] + '/video/update', payload)
        
        print('=========updateAudioPath============',response)     
        return json.loads(response.text)

    except (Exception) as error:
        print("ERROR5::", type(error) ," --> " ,error)


def updateImagePath(videoId, videoPathImage):
    try:
        payload = {'video_id': videoId, 'image_path': videoPathImage}
        print('=====================================',payload)
        response = request_post(config['tasana']['api'] + '/video/update', payload)   
        print('=========updateImagePath============',response)     
        return json.loads(response.text)

    except (Exception) as error:
        print("ERROR6::", type(error) ," --> " ,error)


def updateStatus(videoId, videoStatusId):
    try:
        payload = {'video_id': videoId, 'status': videoStatusId}
        response = request_post(config['tasana']['api'] + '/video/update', payload)
        print('=========updateStatus============',response)  
        return json.loads(response.text)

    except (Exception) as error:
        print("ERROR7::", type(error) ," --> " ,error)


def updatePathSubtitle(videoId, videoPathSubtitle):
    try:
        videoPathSubtitle = videoPathSubtitle.replace("/app/", "")
        print("update: ",videoPathSubtitle)
        payload = {'video_id': videoId,  'subtitle_path': videoPathSubtitle}
        response = request_post(config['tasana']['api'] + '/video/update', payload)
        print('=========updatePathSubtitle============',response)  
        return json.loads(response.text)

    except (Exception) as error:
        print("ERROR8::", type(error) ," --> " ,error)


def createContent(videoId, contentInfo):
    try: 
        payload = {
            'video_id': videoId,
            'subtitleInfo':[
                {
                    'text': contentInfo['sentence'],
                    'start_time': float(contentInfo['start']),
                    'end_time': float(contentInfo['stop'])
                }
            ]
        }
        #print(payload)
        response = requests.post(config['tasana']['api'] + '/subtitle/create', json=payload)
        #print(response)
        return json.loads(response.text)

    except (Exception) as error:
        print("ERROR9::", type(error) ," --> " ,error)


def getVideoTitle(videoId):
    try:      
        payload = {'video_id': videoId}
        response = request_post(config['tasana']['api'] + '/video/search', payload)
        return json.loads(response.text)
        
    except (Exception) as error:
        print("ERROR10::", type(error) ," --> " ,error)


def createElasticIndexData(nameIndex, contentId, videoId, videoTitle, videoCreatedDate, contentSentence):
    try:  
        payload = {
            "index": nameIndex,
            "number": contentId,
            "data": {
                "video_id": videoId,
                "title": videoTitle,
                "videoCreatedDate": videoCreatedDate
            },
        }
        response = requests.post(
            config['sita']['api'] + '/dataIndex/', json=payload,
            headers={'x-access-token': config['tasana']['x-access-token']}
        )
        return response
    except (Exception) as error:
        # raise RequestsExceptions
        print("ERROR11::", type(error) ," --> " ,error)



# def getContentIdAndSentence(videoId):
#     try: 
#         payload = {'videoId': videoId}
#         response = request_post(config['tasana']['api'] + '/content/getContent', payload)
#         return json.loads(response.text)

#     except (Exception) as error:
#         print("ERROR::", type(error) ," --> " ,error)


def getUserIdfromVideoId(videoId):
    try: 
        payload = {'video_id': videoId}
        response = request_post(config['tasana']['api'] + '/video//user-by-video-id', payload)
        res = json.loads(response.text)
        return res

    except (Exception) as error:
        print("ERROR12::", type(error) ," --> " ,error)


def getVideoData(videoId):
    try: 
        payload = {'video_id': videoId}
        response = request_post(config['tasana']['api'] + '/video/search', payload)
        res = json.loads(response.text)
        return res

    except (Exception) as error:
        print("ERROR13::", type(error) ," --> " ,error)



# def getOrganizationById(organizationId):
#     try: 
#         payload = data={'organizationId': organizationId}
#         response = request_post(config['tasana']['api'] + '/organization/search', payload)
#         res = json.loads(response.text)
#         return res

    # except (Exception) as error:
    #     print("ERROR::", type(error) ," --> " ,error)




# # define Python user-defined exceptions
# class Error(Exception):
#     """Base class for other exceptions"""
#     pass


# class ValueTooSmallError(Error):
#     """Raised when the input value is too small"""
#     pass


# class ValueTooLargeError(Error):
#     """Raised when the input value is too large"""
#     pass


# class RequestsExceptions(Error):
#     print(Error)
#     print("============================================================")
#     print("OOPS!! Connection Error. GetVideoByStatus Connection refused")
#     pass