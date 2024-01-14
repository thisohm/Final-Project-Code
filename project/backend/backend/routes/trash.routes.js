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
const trash = require('../controllers/about-trash.controller')


router.post('/list-trash', authorize(), trash.searchListTrash); //show list trash from user_id and org_id

router.post('/trash', authorize(), trash.searchVideoTrash); //show trash video from user_name or video_title

router.post('/recover', authorize(), trash.recoverVideo);//edit

module.exports = router;
