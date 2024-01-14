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

const authorize = require('../../middlewares/authorize');
const manageOrg = require('../../controllers/manage/manage-organization.controller');

router.post('/create', authorize(), manageOrg.create);

router.post('/update', authorize(), manageOrg.update);

router.post('/delete', authorize(), manageOrg.delete);

module.exports = router;
