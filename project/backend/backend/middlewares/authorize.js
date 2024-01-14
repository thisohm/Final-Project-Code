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
// const jwt = require('express-jwt');
const jwt = require("jsonwebtoken");
const environment = process.env;

const privateCert = require("../configs/config-key");
const privateKey = privateCert.privateCert;

const permission_role = require("../configs/config-role");
const organization = require("../models/organization.model");
const User = require("../models/user.model.js");
const Video = require("../models/video.model");
const Refresh_token = require("../models/refresh_token.model");
const { config } = require("dotenv");


module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authorize based on user role
        async (req, res, next) => {
            // console.log('originalUrl => ', req.originalUrl);
            // check for basic token key
            if (req.headers['apikey'] || typeof req.headers['apikey'] !== 'undefined') {
                try {
                    let [userInfo] = await User.getUserById(req.headers['apikey'], { permission_1: true })
                    if (userInfo.length > 0) {
                        let [result] = await Video.getResultInDay(userInfo[0].org_id);
                        req.user = userInfo[0]
                        req.user.permission_1 = (userInfo.role_id === "a227d17b-1d35-4b3d-999c-958361e22ca6")? true : false;     // Super admin superadminpermission is true
                        req.user.videoUsage = result[0].allVideoDuration? result[0].allVideoDuration : 0
                    } else {
                        // Create organization
                        let organizationInfo = new organization({});
                        organizationInfo.org_id = req.headers['apikey']
                        organizationInfo.name = req.headers['apikey']
                        organizationInfo.status = true
                        organizationInfo.package_id = "08442277-f299-4e87-adb9-6e0d9e19f0be"
                        await organization.create(organizationInfo)
                        // Create user
                        let userInfo = new User({});
                        userInfo.org_id = req.headers['apikey']                 // For ai for thai
                        userInfo.user_id = req.headers['apikey']
                        userInfo.user_name = req.headers['apikey']
                        userInfo.user_email = req.headers['apikey'] + "@aiforthai.in.th"
                        userInfo.role_id = "5d1e4d49-376d-4851-b121-7b13ae961147"        // roleId for ai for thai
                        userInfo.userActive = 1
                        await User.create(userInfo)
                        req.user = userInfo;
                        req.user.videoUsage = 0;
                        req.user.permission_1 = (userInfo.roleId === "a227d17b-1d35-4b3d-999c-958361e22ca6")? true : false;     // Super admin superadminpermission is true
                    }
                    next();
                } catch (err) {
                    console.log(err);
                    if (!err.statusCode) {
                        err.statusCode = 401;
                        // err.message = "Missing API key header."
                    }
                    next(err);
                }
            } else if (req.cookies['TASANA_LOGIN_INFO'] || typeof req.cookies['TASANA_LOGIN_INFO'] !== 'undefined') {         // check for basic auth cookies
                try {
                    let [refreshToken] = await Refresh_token.getByToken(req.cookies['TASANA_LOGIN_INFO'])
                    //console.log(refreshToken[0].userId)
                    let [userInfo] = await User.getUserById(refreshToken[0].user_id, { superadminpermission: true });
                    //let [userInfo] = await User.getUserById("677897db-8501-47fe-b4b4-3aa88cf9fe69", { permission_1: true });
                    let [result] = await Video.getResultInDay(userInfo[0].org_id);
                    // authentication and authorization successful
                    req.user = userInfo[0]
                    // req.user.superadminpermission = (req.user.roleId === "a8717515-be10-4e72-8d6d-da622284c2f4")? true : false;
                    req.user.permission_1 = (userInfo[0].roleId === "99999999-0000-0000-0000-999999999999") ? true : false;      // Super admin superadminpermission is true
                    req.user.videoUsage = result[0].allVideoDuration? result[0].allVideoDuration : 0
                    next();
                } catch (err) {
                    console.log(err);
                    if (!err.statusCode) {
                        err.statusCode = 403;
                        err.message = "Incorect token or it is expired.";
                    }
                    next(err);
                }
            } 
            else if (req.headers['x-access-token'] || typeof req.headers['x-access-token'] !== 'undefined') {     // check for basic auth header
                try {
                    console.log(privateKey.toString('utf-8'));
                    let decoded = await jwt.verify(req.headers['x-access-token'], privateKey);
                    let permission_1 = (decoded.role_id === "99999999-0000-0000-0000-999999999999")? true : false;     // superadminpermission is true
                    let permission_2 = (decoded.role_id === "a8717515-be10-4e72-8d6d-da622284c2f4")? true : false; // adminpermission is true
                    let permission_3 = (decoded.role_id === "ecbf4355-952b-4cc2-8136-8353ca55b0d2")? true : false; // memberpermission is true
                    
                    // authentication and authorization successful
                    if (permission_1){ // Super admin permission
                        let [userInfo] = await User.getUserById(decoded.user_id, { org_id: decoded.org_id, permission_1 });
                        req.user = userInfo[0]
                        req.user.permission = permission_role.superadmin
                    } else if (permission_2){ // admin permission
                        let [userInfo] = await User.getUserById(decoded.user_id, { org_id: decoded.org_id, permission_2 });
                        req.user = userInfo[0] 
                        req.user.permission = permission_role.admin
                    } else if (permission_3){ // member permission
                        let [userInfo] = await User.getUserById(decoded.user_id, { org_id: decoded.org_id, permission_3 });
                        req.user = userInfo[0] 
                        req.user.permission = permission_role.member
                    }
                    next();
                } catch (err) {
                    console.log(err);
                    if (!err.statusCode) {
                        err.statusCode = 403;
                        // err.message = "Incorect token or it is expired.";
                    }
                    next(err);
                }
            } else {
                // console.log('req.cookies => ', req.cookies);
                // console.log('req.headers => ', req.headers);
                console.log('authorize => Missing Token key');
                res.status(401).json({ message: "Missing Token key" })
            }
        }
    ];
}
