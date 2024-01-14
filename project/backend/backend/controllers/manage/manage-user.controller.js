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
const Organization = require("../../models/organization.model");
const helperDate = require("../../helpers/date-properties");

// const { validationResult } = require('express-validator');
console.log(privateKey.toString());
let salt = bcrypt.genSaltSync(10);

exports.resetPassword = async (req, res, next) => {
  let { user_id, user_password } = req.body;
  let { permission, org_id } = req.user;
  try {
    if (user_id) {
      let [userItem] = await User.getUserById(user_id, { permission, org_id });
      let dataInfo = new User(userItem[0])
      dataInfo.passwordHash = bcrypt.hashSync(user_password, salt);
      await User.update(dataInfo)
      res.status(200).json({
        statusCode: 200,
        message: "reset password success"
      })
    } else {
      res.status(200).json({
        statusCode: 500,
        message: "failed: no user_id"
      })
    }
  } catch (error) {
    if (!error.statusCode) {
      error.error = error;
      error.statusCode = 500;
      error.message = "error => manage-user: reset password";
    }
    next(error);
  }
}


/* ================================ Token ================================ */
exports.genAPIKey = async (req, res, next) => {
  let { user_id, org_id, endDate } = req.body;
  //let { permission } = req.user;
  /*let user_id = "00000000-xxxx-yyyy-zzzz-999999999999"
  let org_id = "00000000-9999-9999-9999-000000000000"
  let endDate = "2023-12-31"*/
  let permission = true
  try {
    let [userInfo] = await User.getUserById(user_id, { org_id, permission });
    let [organizationInfo] = await Organization.getOrganizationById(org_id, { permission });
    if (userInfo.length > 0 && organizationInfo.length > 0) {
      let token = getToken(userInfo[0], endDate, 'launch');
      if (token) {
        return res.status(200).json({
          statusCode: 200,
          message: 'success',
          result: { 'x-access-token': token }
        });
      } else {
        return res.status(200).json({
          statusCode: 500,
          message: 'failed: date input error'
        });
      }
    } else {
      return res.status(200).json({
        statusCode: 500,
        message: 'failed: data missing'
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.error = error
      error.statusCode = 500;
      error.message = "error => manage-user: get api key";
    }
    next(error);
  }
}

//For login
exports.genToken = async (user, endDate) => {
  return getToken(user, endDate, 'launch');
}

function getToken(user, endDate, type) {
  let { user_id, org_id, role_id } = user;
  try {
    if (type === 'test') {
      return jwt.sign({
        "user_id": "dev-" + user_id,
        "org_id": "dev-" + org_id,
        // "organizationName": "dev-" + organizationName,
      }, privateKey, { expiresIn: '24h' });
    } else if (type === 'launch') {
      return jwt.sign({
        "user_id": user_id,
        "role_id": role_id,
        "org_id": org_id,
      }, privateKey, { expiresIn: helperDate.dateBetween(new Date(Date.now()), endDate) });
    }
    return;
  } catch (error) {
    if (!error.statusCode) {
      error.error = error
      error.statusCode = 500;
      error.message = "error => manage-user: get token";
    }
    next(error);
  }
}

function tokenDetail(token) {
  let { org_id, organizationName } = token;
  return { org_id, organizationName };
}
/* ================================ End Token ================================ */


Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}

function setUpUserDetails(user) {
  let { user_id, userName, userEmail, userActive, org_id, organizationName, role_id, roleName, revokedDate } = user;
  return { user_id, userName, userEmail, userActive, org_id, organizationName, role_id, roleName, revokedDate };
}