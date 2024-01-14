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

const Video = require("../models/video.model.js");
const SecToTime = require("../helpers/sec-to-time");

exports.searchListTrash = async (req, res, next) => {
    let { sort_by, num_per_page, num_start_page } = req.body;
    let { user_id, org_id, } = req.user;
    if (user_id && org_id) {
        try {
            let [video] = await Video.getsearchListTrash( user_id, org_id, sort_by, num_per_page, num_start_page);
            for (let element of video) {
                element.duration = SecToTime(element.duration)
                if (element.is_owner === user_id){
                    element.is_owner = 1
                } else {
                    element.is_owner = 0
                }
            }
            //console.log(video.length)
            if (video.length > 0){
                res.status(200).json({status: "1",result: video})
            } else {
                res.status(200).json({
                    status: "0",
                    message: "No video in trash."
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}

exports.searchVideoTrash = async (req, res, next) => {
    let { search_query } = req.body;
    let { org_id, user_id } = req.user;
    if (search_query) {
        try {
            let [video] = await Video.getSearchVideoTrash(user_id, org_id, search_query );
            for (let element of video) {
                element.duration = SecToTime(element.duration)
                if (element.is_owner === user_id){
                    element.is_owner = 1
                } else {
                    element.is_owner = 0
                }
            }
            if (video.length > 0){
                res.status(200).json({status: "1",result: video})
            } else {
                res.status(200).json({
                    status: "0",
                    message: "No video in trash."
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}

exports.recoverVideo = async (req, res, next) => {
    let { video } = req.body;
    let { user_id, org_id } = req.user;
    //console.log("permission: ", permission);
    //user_id org_id match video_id
    if (user_id && org_id) {
        try {
            let recover_video = [];
            for (let element of video) {
                let [videoItem] = await Video.getDeletedById(element.video_id);
                if (element.deleted_timestamp !== null){
                    await Video.setRecoverVideo( element.video_id, { user_id, org_id } );
                }
                recover_video.push({ video_id: element.video_id });
            }
            if (recover_video.length === video.length){
                res.status(200).json({
                    status: 1,
                    message: "All selected video recovered"
                })
            } else if (recover_video.length === 0){
                res.status(200).json({
                    status: 0,
                    message: "All selected video is not recovered"
                })
            } else {
                res.status(200).json({
                    status: 2,
                    message: "Some selected video is recovered",
                    video_id: "Video recoverd is: " + recover_video
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}
