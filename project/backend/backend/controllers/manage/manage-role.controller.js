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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const privateCert = require("../../configs/config-key");
const privateKey = privateCert.privateCert;

const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const e = require("express");


exports.updateRole = async (req, res, next) => {
    let { roleInfo } = req.body;
    let { org_id, permission } = req.user;
    //for superadmin & admin
    if (roleInfo) {
        try {
            for (let element of roleInfo){
                let [role] = await Role.getRoleIdByName( element.user_role );
                await User.updateUserRole( element.user_id, role[0].role_id, { org_id, permission } );
            }
            res.status(200).json({status: 1})
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
                error.message = "no such role in database"
            }
            next(error);
        }
    }
}

exports.deleteRole = async (req, res, next) => {
    let { role_id } = req.body;
    let { permission } = req.user;
    //for superadmin
    try {
        await Role.delete( role_id ,{ permission });
        res.status(200).json({status: 1})
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "Error you not have a permission."
        }
        next(error);
    }
}

exports.getRole = async (req, res, next) => {
    let { role_id } = req.body;
    //let { user_id, org_id, permission } = req.user;
    try {
        let [roleInfo] = await Role.getRoleByID( role_id );  
        res.status(200).json({status: 1})
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error"
        }
        next(error);
    }
} 