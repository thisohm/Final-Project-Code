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

const fs = require('fs');
const Video = require("../models/video.model.js");
const Subtitle = require("../models/subtitle.model.js");
const SecToTime = require('../helpers/sec-to-time');

exports.searchSubByVideoId = async (req, res, next) => {
    let { video_id } = req.body
    try {
        let [subtitleInfo] = await Subtitle.searchSubByVideoId(video_id);
        for (let element of subtitleInfo) {
            element.start_time = SecToTime(element.start_time)
            element.end_time = SecToTime(element.end_time)
        }
        let subtitleShow = []
        for (let element of subtitleInfo) {
            subtitleShow.push({
                text: element.text,
                sub_id: element.sub_id,
                start_time: element.start_time,
                end_time: element.end_time}
            )
        }
        //console.log(subtitleInfo[0].video_id)
        if (subtitleShow.length > 0){
            res.status(200).json({
                video_id: video_id,
                video_path: subtitleInfo[0].video_path,
                result: (subtitleShow) 
            })
        } else {
            res.status(403).json({  video_id: video_id, message: "No data available." })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.searchByVideoId = async (req, res, next) => {
    let { video_id } = req.body
    try {
        let [content] = await Subtitle.searchByVideoId(video_id);
        res.status(200).json(content)
    } catch (err) {
        console.log(err);
    }
}

//Search by keyword in video_id
exports.findBySubtitle = async (req, res, next) => {
    let { video_id, keyword } = req.body
    let { user_id, org_id } = req.user
    //No permission require
    try {
        let [allWord] = await Subtitle.searchByword(user_id, org_id, video_id, keyword);
        for (let element of allWord) {
            element.start_time = SecToTime(element.start_time)
            element.end_time = SecToTime(element.end_time)
        }
        let subtitleShow = [] 
        for (let element of allWord) {
            subtitleShow.push({
                text: element.text,
                sub_id: element.sub_id,
                start_time: element.start_time,
                end_time: element.end_time
            })
        }
        if (subtitleShow.length > 0){
            res.status(200).json({
                video_id: video_id,
                result: (subtitleShow) 
            })
        } else {
            res.status(403).json({  video_id: video_id, message: "No data available." })
        }
    } catch (err) {
        console.log(err);
    }
}

//Create subtitle for service python
exports.createsubtitle = async (req, res, next) => {
    let { subtitleInfo , video_id} = req.body;
        try {
            for (let element of subtitleInfo) {
                let dataInfo = new Subtitle(Subtitle);
                dataInfo.text = element.text;
                dataInfo.start_time = element.start_time;
                dataInfo.end_time = element.end_time;
                dataInfo.sub_id = uuid.v4();
                await Subtitle.createSubtitle(dataInfo, video_id)
            }
            res.status(200).json({status: "1"});
        } catch (err) {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 400;
                err.message = "status: 0";
        }
        next(err);
    }
}


exports.getContent = async (req, res, next) => {
    let { video_id, sub_id } = req.body;
    if (video_id && sub_id) {
        try {
            let [content] = await Subtitle.getContentByVideoIdAndContentId(video_id, sub_id)
            //content[0].start_time = SecToTime(content[0].start_time)
            //content[0].end_time = SecToTime(content[0].end_time)
            res.status(200).json(content);
        } catch (err) {
            console.log(err);
        }
    }
    else if (video_id) {
        try {
            let [content] = await Subtitle.getContentByVideoId(video_id);
            for (let element of content) {
                element.start_time = SecToTime(element.start_time)
                element.end_time = SecToTime(element.end_time)
            }
            res.status(200).json(content);
        } catch (err) {
            console.log(err);
        }
    }
    else if (sub_id) {
        try {
            let [content] = await Subtitle.getContentByContentId(sub_id);
            res.status(200).json(content);
        } catch (err) {
            console.log(err)
        }
    }
    else {
        res.status(400).json({
            message: "Please fill video_id or sub_id"
        })
    }
}

//Edit subtitle
exports.edit = async (req, res, next) => {
    let {video_id, subtitleInfo} = req.body;
    //check type Edit Delete Create
    try {
        for (let element of subtitleInfo) {
            let dateFormat = /([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(:|\.)\d{3}/;
            if (element.mode === "1" && dateFormat.test(element.start_time) && dateFormat.test(element.end_time)){ //update
                //console.log("start time : ",element.start_time)
                element.start_time = TimeCodeToSeconds(element.start_time)
                element.end_time = TimeCodeToSeconds(element.end_time)
                let [videoItem] = await Subtitle.searchByVideoId(video_id);
                let dataInfo = new Subtitle(videoItem[0]);
                dataInfo.text = element.text;
                dataInfo.sub_id = element.sub_id;
                dataInfo.start_time = element.start_time;
                dataInfo.end_time = element.end_time;
                await Subtitle.editSubtitle(dataInfo, video_id)
            } else if (element.mode === "0"){ //create
                element.start_time = TimeCodeToSeconds(element.start_time)
                element.end_time = TimeCodeToSeconds(element.end_time)
                let dataInfo = new Subtitle(Subtitle);
                dataInfo.text = element.text;
                dataInfo.start_time = element.start_time;
                dataInfo.end_time = element.end_time;
                dataInfo.sub_id = uuid.v4();
                //console.log(dataInfo.sub_id)
                await Subtitle.createSubtitle(dataInfo, video_id)
            } else if (element.mode === "2"){ //delete
                await Subtitle.delete(element.sub_id, video_id)
            }
        }
        //console.log(subtitleInfo)
        res.status(200).json({ status: "1" });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "status: 0";
        }
        next(err);
    }
}

exports.downloadSubtitle = async (req, res, next) => {
    let video_id = req.query.video_id;
    let extension = req.query.extension;
    let file;
    let [directory_path] = await Video.getVideoById(video_id);
    if (extension === "vtt"){
        file = directory_path[0].subtitle_path;
    } else if (extension === "srt"){
        file = directory_path[0].subtitle_path;
        file = file.replace(".vtt", ".srt");
    }
    let filename = path.basename(file);
    let mimetype = mime.lookup(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
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

exports.updateClosedcaption = async (req, res, next) => {
    let { video_id } = req.body;
    try {
        let [lsContent] = await Subtitle.getContentByVideoId(video_id);
        let [directory_path] = await Video.getVideoById(video_id);
        let path = directory_path[0].subtitle_path;
        let i = 0
        let text = `WEBVTT FILE\n`
        text += '\n'
        for (let element of lsContent){
            //console.log(element)
            if ( element.start_time && element.end_time || element.start_time === 0) {
                i += 1
                let start = element.start_time
                let stop = element.end_time
                text += i + '\n'
                text += (convertSecToTimeFormatSingle(start) + " --> " + convertSecToTimeFormatSingle(stop)) + '\n'
                text += element.text + '\n'
                text += '\n'
                fs.writeFile(path, text, function (err) {
                    if (err) throw err;
                        //console.log('Replaced VTT!');
                });
            }
        }
        path = path.replace(".vtt", ".srt");
        let j = 0
        text = ''
        for (let element of lsContent){
            if ( element.start_time && element.end_time || element.start_time === 0) {
                j += 1
                let start = element.start_time;
                //console.log(start)
                let stop = element.end_time;
                text += j + '\n'
                text += (convertSecToTimeFormatSingleSRT(start) + " --> " + convertSecToTimeFormatSingleSRT(stop)) + '\n'
                text += element.text + '\n'
                text += '\n'
                fs.writeFile(path, text, function (err) {
                    if (err) throw err;
                        //console.log('Replaced SRT!');
                });
            }
        }
        res.status(200).json({ message: "Update closedcaption" })
    } catch (err) {
        console.log(err);
    }
}

exports.delete = async (req, res, next) => {
    let { body } = req;
    if (body.sub_id) {
        try {
            await Subtitle.delete(body.sub_id);
            res.status(200).json({ message: "Delete!" })
        } catch (err) {
            console.log(err);
        }
    }
}

// ================================ Helper Functions ================================

//Change hh:mm:ss.ms to seconds
function TimeCodeToSeconds(value) {
    let [hours, minutes, sec_ms] = value.split(':');
    let [seconds, millisecond] = sec_ms.split('.');
    millisecond = Number(millisecond) / 1000;
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds) + millisecond;
}

function convertSecToTimeFormatSingle(sec) {
    //console.log("sec",sec)
    sec = sec * 1000;
    let milliseconds = (sec % 1000).toFixed(0); // remove precision
    let seconds = Math.floor((sec / 1000) % 60);
    let minutes = Math.floor((sec / (1000 * 60)) % 60);
    let hours = Math.floor((sec / (1000 * 60 * 60)) % 24);
    // format
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0") + "." + String(milliseconds).padStart(3, "0");
}

function convertSecToTimeFormatSingleSRT(sec) {
    sec = sec * 1000;
    let milliseconds = (sec % 1000).toFixed(0); // remove precision) % 60);
    let seconds = Math.floor((sec / 1000) % 60);
    let minutes = Math.floor((sec / (1000 * 60)) % 60);
    let hours = Math.floor((sec / (1000 * 60 * 60)) % 24);
    // format
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0") + "," + String(milliseconds).padStart(3, "0");
}

// ================================ Helper Functions End ================================