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
const e = require("express");
const uuid = require("uuid");

const Organization = require("../models/organization.model");
const User = require("../models/user.model");

exports.memberInfo = async (req, res, next) => {
    let { role_id, org_id, permission} = req.user;
    //permission required superadmin & admin (permission_1 & permission_2)
    try {
        let [userInfo] = await User.getUserByOrgID(org_id, permission);
        if (userInfo.length > 0){
            res.status(200).send({ result: userInfo })
        } else {
            res.status(200).send({status: 0, message: "No data or you not have permission"})
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => some thing went wrong.";
        }
        next(error);
    }
}