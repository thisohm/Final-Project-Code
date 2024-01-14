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
const express = require('express')
const router = express.Router()

const authorize = require('../middlewares/authorize');
const userApiAuth = require('../controllers/user-api.auth.controller');
const userapitoken = require('../controllers/manage/manage-user.controller')

router.route('/login').post(userApiAuth.authenticate); //user login (POST) 

router.route('/search-ID').post(authorize(), userApiAuth.searchByID); //only admin search user (POST) 
 
router.route('/search-keyword').post(userApiAuth.searchByKeyword); //user seach from keyword -> email or username (POST) 

router.route('/delete').post(authorize(),userApiAuth.delete); //delete user (POST) 

router.route('/register').post(userApiAuth.create); //register new user (POST)

router.route('/profile').post(authorize(), userApiAuth.getProfile);

router.route('/invite').post(authorize(), userApiAuth.emailInvite);

//token

router.route('/auth/user-token').get(authorize(), userApiAuth.getUserByToken);

router.route('/refresh-token').post(userApiAuth.refreshToken);

router.route('/revoke-token').post(userApiAuth.revokeToken);

router.route('/api-key').post(authorize(),userapitoken.genAPIKey);


module.exports = router