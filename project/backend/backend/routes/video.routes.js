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
const express = require('express');
const router = express.Router();

const authorize = require('../middlewares/authorize');
const video = require('../controllers/about-video.controller.js')
const fileUpload = require('../helpers/file-upload');

const generateFileOperation = require('../helpers/file-generate-operation');
//const SecToTime = require('../helpers/sec-to-time');


router.post('/list', authorize(), video.searchList); //show list video from user_id org_id fav_icon

router.post('/change-status', authorize(), video.deleteFromactive); //change status video 1 -> 0

router.post('/search- keyword', video.searchVideoKeyword); //edit

router.post('/create', generateFileOperation(), fileUpload.uploadFileForUI(), authorize(), video.create); 

router.get('/all-list', video.get) //get all video

router.post('/meet-id-list', video.getVideoByMeetId) //get video by meeting id

router.post('/status', video.statusVideo); //search video by status

router.post('/update', authorize(), video.update);

router.get('/image', video.getImage);// dowload image

router.get('/download', video.getVideo);// dowload video  

router.post('/delete', authorize(), video.permanentDelete); //delte video status = 0

router.post('/user-by-video-id', video.userInfoID);

module.exports = router;
