//
// Author: Kasidich Kiettivut
//
// Create: 01 Dec 2022
//
// Copyright @2022 Ai9 Co., Ltd.. All Rights Reserved
//
// Source Code License. Subject to the terms and conditions of this Platform,
// if You separately acquire a Source Code License, You are licensed to use
// the Source Code. A separate independent Source Code License is also required
// for each affiliate or subsidiary using the SOFTWARE. You are hereby granted
// a license to use the Source Code solely for the purposes based upon your
// purchased option.
// The Source Code may not routinely be delivered with all versions of the SOFTWARE.
// The following limitations to your Source Code License shall apply:
//
const uuid = require("uuid");
const path = require("path");
const mime = require('mime-types');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const { uploadFileForAPI } = require("../helpers/file-upload");
const fileOperation = require("../helpers/file-operation")

const Video = require("../models/video.model.js");
const SecToTime = require('../helpers/sec-to-time');
const SecToTimeHMS = require('../helpers/sec-to-time');

const roundedDurationStep = 15;  // second

exports.searchList = async (req, res, next) => {
    let { sort_by } = req.body;
    let { user_id, org_id } = req.user;
    //require headers not require permission
    if (user_id && org_id) {
        try {
            let [video] = await Video.getListvideofile( user_id, org_id, sort_by );
            for (let element of video) {
                //element.duration = new Date(element.duration * 1000).toISOString().substr(11, 8)
                element.duration = SecToTime(element.duration)
                if (element.is_owner === user_id){
                    element.is_owner = 1
                } else {
                    element.is_owner = 0
                }
            }
            res.status(200).json({result: video})
        } catch (err) {
            console.log(err);
        }
    }

}

exports.statusVideo = async (req, res, next) => {
    let { video_status } = req.body;
    try {
        let [video] = await Video.getVideoByStatus(video_status);
        res.status(200).json({result: video})
    } catch (err) {
        console.log(err);
    }
    
}

exports.searchVideoKeyword = async (req, res, next) => {
    let { search_query } = req.body;
    //let { permission, org_id, user_id } = req.user;
    if (search_query) {
        try {
            let [video] = await Video.getSearchVideofile(search_query);
            for (let element of video) {
                element.duration = SecToTime(element.duration)
            }
            
            res.status(200).json({result: video})
        } catch (err) {
            console.log(err);
        }
    }

}

exports.videoById = async (req, res, next) => {
    let { video_id } = req.body;
    //let { permission, org_id, user_id } = req.user;
    if (video_id) {
        try {
            let [video] = await Video.getVideoById(video_id);
            res.status(200).json(video)
        } catch (err) {
            console.log(err);
        }
    }

}

exports.deleteFromactive = async (req, res, next) => {
    let { video_id } = req.body;
    let { user_id, org_id } = req.user;
    if (req.body.video_id) {
        try {
            let [video] = await Video.getVideoById(video_id);
            await Video.getdeleteFromActive( user_id, org_id, video_id );
            let [check] = await Video.getVideoByIdDeleted(video_id);
            
            if (video[0].deleted_timestamp !== check[0].deleted_timestamp){
                res.status(200).json({ status: 1 })
            } else {
                res.status(200).json({ status: 0 })
            }
        } catch (err) {
            console.log('err => ', err);
            if (!err.statusCode) {
                err.statusCode = 500;
                err.message = "failed"
            }
            next(err);
        }
    }   
}

exports.permanentDelete = async (req, res, next) => {
    let { video } = req.body;
    let { user_id, org_id, permission } = req.user;
    try {
        for (let element of video) {
            await Video.permanentDelete(element.video_id, { user_id, org_id, permission });
            //console.log(element.video_id)
        }
        res.status(200).json({ status: "1" })
    } catch (err) {
        console.log('err => ', err);
        if (!err.statusCode) {
            err.statusCode = 500;
            res.status(500).json({ status: "0" })
        }
        next(err);
    }
}

exports.update = async (req, res, next) => {
    let { body } = req;
    let { user_id } = req.user;
    try {
        if (body.video_id){
            let [videoItem] = await Video.getVideoById(body.video_id);
            let dataInfo = new Video(videoItem[0]);
            dataInfo.video_id = body.video_id;
            dataInfo.meeting_id = body.meeting_id ? body.meeting_id : videoItem[0].meeting_id;
            dataInfo.title = body.title ? body.title : videoItem[0].title;
            dataInfo.video_path = body.video_path ? body.video_path : videoItem[0].video_path;
            dataInfo.audio_path = body.audio_path ? body.audio_path : videoItem[0].audio_path;
            dataInfo.subtitle_path = body.subtitle_path ? body.subtitle_path : videoItem[0].subtitle_path;
            dataInfo.image_path = body.image_path ? body.image_path : videoItem[0].image_path;
            dataInfo.duration = body.duration ? body.duration : videoItem[0].duration;
            dataInfo.amount = body.amount ? body.amount : videoItem[0].amount;
            dataInfo.status = body.status ? body.status : videoItem[0].status;
            dataInfo.deleted_timestamp = body.deleted_timestamp ? new Date(req.body.deleted_timestamp) : videoItem[0].deleted_timestamp;
            await Video.update(dataInfo, user_id);
        }
        res.status(200).json({
            status: "1",
            message: "success"
        })
    } catch (err) {
        console.log('err => ', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.create = async (req, res, next) => {
    let { title ,meeting_id} = req.body
    let { user_id, org_id, role_id, permission } = req.user
    if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
    }
    else if (title == undefined) {
        return res.status(400).send({ message: "Please fill title name" });
    }
    try {
        ffmpeg(`${req.file.path}`)
            .ffprobe(0, async (err, metadata) => {
                let videoDuration = metadata.streams[0].duration
                let mod = videoDuration % roundedDurationStep
                let videoDurationPackage = videoDuration - mod
                if (mod > 0) {
	                videoDurationPackage += roundedDurationStep
                }
                //let [packageInfo] = await Package.getPackageByOrganizationId({ org_id, permission })
                //let organizationLimited = packageInfo[0].packageTimeLimit
                //let limited = organizationLimited / 60
                if (user_id) {
                    if (true/*Number(videoDuration) + Number(video_usage) < Number(organizationLimited)*/) {
                        await uploadFileForAPI(req, res);
                        let ext = path.extname(req.file.filename);
                        let dataInfo = new Video("");
                        dataInfo.video_id = uuid.v4();
                        dataInfo.meeting_id = meeting_id
                        dataInfo.user_id = user_id
                        dataInfo.title = title;
                        dataInfo.created_timestamp = new Date(Date.now())
                        dataInfo.amount = 100;
                        dataInfo.video_path = `${req.fileDetail.fileDirectory}/${req.fileDetail.fileName}${ext}`;
                        dataInfo.duration = videoDuration;
                        //dataInfo.videoDurationPackage = videoDurationPackage;
                        dataInfo.status = 1;
                        //dataInfo.videoActive = 1;
                        //dataInfo.videoCreator = "Aiforthai";
                        await Video.create(dataInfo);
                        return res.status(200).json({
                            message: "success",
                            video: dataInfo
                        });
                    } else {
                        await fileOperation.delete_dir_file(`${req.fileDetail.fileDirectory}/${req.fileDetail.fileName}.mp4`)
                        return res.status(200).send({ message: "Limited" })
                        //response -> Limited: `${limited} mins per day`
                    }
                } else {
                    await uploadFileForAPI(req, res);
                    let dataInfo = new Video("");
                    dataInfo.video_id = uuid.v4();
                    dataInfo.meeting_id = meeting_id
                    dataInfo.user_id = user_id
                    dataInfo.title = title;
                    dataInfo.created_timestamp = new Date(Date.now())
                    dataInfo.amount = 100;
                    dataInfo.video_path = `${req.fileDetail.fileDirectory}/${req.fileDetail.fileName}.mp4`;
                    dataInfo.duration = videoDuration;
                    //dataInfo.videoDurationPackage = videoDurationPackage;
                    dataInfo.status = 1;
                    //dataInfo.videoActive = 1;
                    //dataInfo.videoCreator = "Aiforthai";
                    await Video.create(dataInfo);
                    return res.status(200).json({
                        status: 1,
                        message: "success",
                        video: dataInfo
                    });
                }
            })
    } catch (err) {
        console.log('create err => ', err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "uploadfile ERROR!"
        }
        next(err);
    }
}

exports.get = async (req, res, next) => {
    try{
        let [dataInfo] = await Video.get();
        
        for (let element of dataInfo) {
            element.duration = SecToTime(element.duration)
        }
        res.status(200).json({ 
            message:"Video get success",
            result: dataInfo
        })
    }
    catch (error) {
        if(!error.statusCode) {
            error.error = error
            error.statusCode = 500;
            error.message = "Video get failed";
        }
        next(error);
    }
}

exports.getVideoByMeetId = async (req, res, next) => {
    let {meeting_id}  = req.body
    
    try{
        let [dataInfo] = await Video.getVideoByMeetId(meeting_id)

        res.status(200).json({ 
            message:"Video get success",
            result: dataInfo
        })
    }
    catch (error) {
        if(!error.statusCode) {
            error.error = error
            error.statusCode = 500;
            error.message = "Video get by meeting_id failed";
        }
        next(error);
    }

}

exports.getImage = async (req, res, next) => {
    let video_id = req.query.video_id;
    let [directory_path] = await Video.getVideo(video_id);
    res.download(directory_path[0].image_path, (err) => {
        if (err){
            res.status(500).send({
                message: "Could not dowload the file " + err,
            });
        }
    });
};

exports.getVideo = async (req, res, next) => {
    let video_id = req.query.video_id;
    let [directory_path] = await Video.getVideoById(video_id);
    let file = directory_path[0].video_path;
    let filename = path.basename(file);
    let mimetype = mime.lookup(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    //let filestream = fs.createReadStream(file);
    //filestream.pipe(res);
    let pathUrl = req.path;
    if (pathUrl !== '/') {
        res.download(file, (err) => {
            if (err){
                console.log("Error => ",err);
            }
        });
    } else {
        next();
    }
};

exports.userInfoID = async (req, res, next) => {
    let { video_id } = req.body;
    try {
        let [userInfo] = await Video.getUserByVideoID(video_id);
        res.status(200).json({user_id: userInfo[0].user_id})
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => get data user or you do not have permission"
        }
        next(error);
    }
}