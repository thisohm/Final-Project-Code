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
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const environment = process.env;

const privateCert = require("../configs/config-key");
const privateKey = privateCert.privateCert;

const User = require("../models/user.model.js");
const Refresh_token = require("../models/refresh_token.model.js");
const helperDate = require("../helpers/date-properties");
const Manage = require("../controllers/manage/manage-user.controller");
const Role = require("../models/role.model");
const role = require("../models/role.model");

exports.authenticate = async ({ user_email, password, ipAddress }) => {
    try {
        const [lsUser] = await User.getUserByEmail(user_email, { permission: true });      
        if (lsUser.length > 0) {
            const user = lsUser[0]; 
            const date =  new Date();
            date.setDate(date.getDate() + 3);
            const endDate = date.toISOString().split('T')[0];
    
            let token = await Manage.genToken( user, endDate );
            let [role_name] = await Role.getRoleByEmail(user_email); 
            //dcrypt passwordhash
            if (!user || !bcrypt.compareSync(password, user.passwordhash)) {
                return { statusCode: 404, status: 0, error_message: "failed: Email or password is incorrect" };
            }
    
            return {
                statusCode: 200, status: 1, message: "success",
                results: {
                    ...basicDetails(user),
                    token: token,
                    role: role_name[0].name
                }
            };
        } else {
            return { status: 0, message: "failed: user not found" };
        }
    } catch (error) {
        return {
            statusCode: 500, 
            message: "error: user nauthenticate",
            error: error
        };
    }

}

exports.refreshToken = async ({ token, ipAddress }) => {

    const refreshToken = await getRefreshToken(token);
    const [user] = await User.getUserById(refreshToken.user_id, { permission: true });

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user[0], ipAddress);
    refreshToken.revoked = new Date(Date.now());
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;

    await Refresh_token.update(refreshToken);
    await Refresh_token.create(newRefreshToken);

    // generate new jwt
    const accessToken = generateJwtToken(user[0]);
    // return basic details and tokens
    return {
        ...basicDetails(user[0]),
        accessToken,
        refreshToken: newRefreshToken
    };
}

exports.revokeToken = async (token, ipAddress) => {
    const [refreshToken] = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = new Date(Date.now());
    refreshToken.revokedByIp = ipAddress;
    await Refresh_token.update(refreshToken);
}

exports.getAll = async () => {
    const [users] = await User.findAll();
    await users.forEach(x => { x.userActive = (x.userActive === 1) ? true : false; })
    return users.map(x => setUpUserDetails(x));
}

exports.getUserByRefreshToken = async (token) => {
    const [userInfo] = await Refresh_token.findByToken(token);
    const [user] = await User.getUserById(userInfo[0].user_id, { permission: true });
    return basicDetails(user[0]);
}

exports.getById = async (id) => {
    const [user] = await User.getById(id);
    return basicDetails(user[0]);
}

exports.getRefreshTokens = async (user_id) => {
    // check that user exists
    await getUser(user_id);

    // return refresh tokens for user
    const [refreshTokens] = await Refresh_token.searchById(user_id);
    return refreshTokens;
}

// helper functions

async function getUser(id) {
    const [user] = await User.getUserById(id, { permission: true });
    if (!user) throw 'User not found';
    return user;
}

async function getRefreshToken(token) {
    const [refreshToken] = await Refresh_token.getByToken(token);
    // if (!refreshToken[0] || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken[0];
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that token_expires in 15 minutes
    return jwt.sign({ user_id: user.user_id }, privateKey, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that token_expires in 7 days
    return new Refresh_token({
        user_id: user.user_id,
        token: 'access-token-' + randomTokenString(),
        token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function addMinutes(date, minutes) {
    return new Date(date + minutes * 60000);
}

function basicDetails(user) {
    const { user_id, user_name, user_email, org_id, role_id, user_status, profile_pic, org_name, acc_type} = user;
    let dataInfo = {
        user_id: user_id,
        user_name: user_name,
        user_email: user_email,
        role_id: role_id,
        org_id: org_id,
        user_status: user_status,
        profile_pic: profile_pic,
        org_name: org_name,
        acc_type: acc_type
    };
    return dataInfo;
}

function setUpUserDetails(user) {
    const { user_id, userName, user_email, userActive, organizationId, organizationName, roleId, roleName } = user;
    return { user_id, userName, user_email, userActive, organizationId, organizationName, roleId, roleName };
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
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
    }
  }