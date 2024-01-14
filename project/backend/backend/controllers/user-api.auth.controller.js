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
const nodemailer = require("nodemailer");

const userService = require("../service/user.service");
const User = require("../models/user.model");
const Organization = require("../models/organization.model");


const environment = process.env;

let salt = bcrypt.genSaltSync(10);

// hashCode = function(s) {
//     return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
//   }

exports.getProfile = async (req, res, next) => {
    let { user_id } = req.user;
    //No permission required
    try {
        let [userInfo] = await User.userProfile( user_id );
        res.status(200).json({result: userInfo}); 
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error"
        }
        next(error);
    }
}

exports.searchByKeyword = async (req, res, next) => {
    let { search_query } = req.body;
    //let { org_id, role_id, adminpermission, superadminpermission } = req.user;
    //No permission required
    try {
        let [userInfo] = await User.searchByKeyword(search_query);
        res.status(200).json(userInfo) 
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error"
        }
        next(error);
    }
}

exports.searchByID = async (req, res, next) => {
    let { user_id } = req.body;
    let { org_id, role_id, permission } = req.user;
    //permission required superadmin & admin (permission_1 & permission_2)
    try {
        let [userInfo] = await User.getUser(user_id, { org_id, role_id, permission })
        if (userInfo.length > 0){
            //console.log( userInfo )
        } else {
            console.log("No permission required")
            [userInfo] = "No permission required";
        }
        res.status(200).json(userInfo)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => get data user or you do not have permission"
        }
        next(error);
    }
}

exports.authenticate = (req, res, next) => {
    const { user_email, password } = req.body;
    const ipAddress = req.ip;
    userService.authenticate({ user_email, password, ipAddress })
        .then((auth) => {
            if (auth.statusCode == 200) {
                let dataInfo = {
                    //basic info
                    user_status: auth.results.user_status,
                    user_id: auth.results.user_id,
                    user_name: auth.results.user_name,
                    profile_pic: auth.results.profile_pic,
                    org_id: auth.results.org_id ,
                    org_name: auth.results.org_name,
                    acc_type: auth.results.acc_type,
                    role: auth.results.role,
                    //token info
                    token : auth.results.token,
                    expiresIn: null,
                }
                res.status(200).json({
                    status: 1,
                    message: "success",
                    result: dataInfo
                });
            } else {
                console.log(auth)
                res.status(500).json(auth)
            }
        })
        .catch(next);
}


exports.getUserByToken = async (req, res, next) => {
    try {
        if (req.user) {
            res.status(200).json(basicDetails(req.user))
        }
    } catch (error) {
        if (!error.statusCode) {
            error.error = error
            error.statusCode = 500;
            error.message = "error => auth: get user by token";
        }
        next(error);
    }
}

exports.create = async (req, res, next) => {
    let { acc_type, org_name, user_email, user_name, password } = req.body
    let create_user_status = 0
    let create_org_status = 0
    if (acc_type === 'individual'){
        org_name = user_name;
    }
    let checkEmail = await checkDuplicateEmail(user_email, next)
    let checkOrgname = await checkDuplicateOrg(org_name, next)
    //No permission required
    if (checkEmail.results.length == 0 && checkOrgname.results.length == 0) {
        try {
            if (acc_type === 'individual'){
                //crete organizationInfo
                let organizationInfo = new Organization()
                organizationInfo.package_id = "9dddd907-df36-429b-b541-2ada41757248"     // default 
                organizationInfo.org_id = uuid.v4()
                organizationInfo.name = org_name
                organizationInfo.status = true
                organizationInfo.created_timestamp = new Date(Date.now());
                //organizationInfo.org_update = new Date(Date.now());
                await Organization.create_org(organizationInfo,{ permission : true });
                create_org_status == 1;
                //crete userInfo Individual
                let userInfo = new User()
                userInfo.acc_type = acc_type
                //userInfo.org_id = organizationInfo.org_id
                userInfo.role_id = "a8717515-be10-4e72-8d6d-da622284c2f4"                // role admin
                userInfo.user_id = uuid.v4()
                userInfo.org_id = organizationInfo.org_id
                userInfo.name = user_name
                userInfo.email = user_email
                userInfo.status = true
                userInfo.profile_pic = null
                userInfo.created_timestamp = new Date(Date.now());
                userInfo.passwordhash = bcrypt.hashSync(password, salt) 
                await User.create(userInfo);
                create_user_status == 1;
            } else if (acc_type === 'organization'){
                //crete organizationInfo
                let organizationInfo = new Organization()
                organizationInfo.package_id = "9dddd907-df36-429b-b541-2ada41757248"     // default 
                organizationInfo.org_id = uuid.v4()
                organizationInfo.name = org_name
                organizationInfo.status = true
                organizationInfo.created_timestamp = new Date(Date.now());
                //organizationInfo.org_update = new Date(Date.now());
                await Organization.create_org(organizationInfo,{ permission : true });
                create_org_status == 1;
                //crete userInfo
                let userInfo = new User()
                userInfo.acc_type = acc_type
                userInfo.org_id = organizationInfo.org_id
                userInfo.role_id = "a8717515-be10-4e72-8d6d-da622284c2f4"                // role admin
                userInfo.user_id = uuid.v4()
                userInfo.name = user_name
                userInfo.email = user_email
                userInfo.status = true
                userInfo.profile_pic = null
                userInfo.created_timestamp = new Date(Date.now());
                userInfo.passwordhash = bcrypt.hashSync(password, salt) 
                await User.create(userInfo);
                create_user_status == 1;
            }
            res.status(200).json({
                status: 1,
                message: "success"
            })
        } catch (error) {
            if (!error.statusCode) {
                res.status(500).json({
                    status: 0,
                    message: "Error => register"
            })
            }
            next(error);
        }
    } else if (checkEmail.results.length != 0){
        res.status(200).json({
            status: 0,
            error_code: 1,
            message: "duplicate email"
        }) //duplicate email
    } else if (checkOrgname.results.length != 0){
        res.status(200).json({
            status: 0,
            error_code: 0,
            message: "duplicate org_name"
        }) //duplicate org_name
    } else {
        res.status(200).json({
            status: 0,
            error_code: 2,
            message: "duplicate org_name, email etc."
        }) //duplicate org_name, email etc.
    }
}

exports.delete = async (req, res, next) => {
    let { user_id } = req.body;
    let { role_id, org_id, permission} = req.user;
    //permission required superadmin & admin (permission_1 & permission_2)
    try {
        let [dataInfo] = await User.getUserById(user_id);
        if (dataInfo[0].length === 0){
            res.status(403).send({status: 0, message: "No data or you not have permission"})
        } else {
            await User.deleteUser(user_id, { role_id, org_id, permission });
            res.status(200).send({status: 1, message: "Success"})
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => cannot delete user";
        }
        next(error);
    }
}

exports.emailInvite = async (req, res, next) => {
    let {email} = req.body;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "mathilde.hintz@ethereal.email", // generated ethereal user
            pass: "SU3GYqFeNtKTxws7M9", // generated ethereal password
        },
    });
    // send mail with defined transport object
    let msg = {
        from: '"The test app" <theExpressApp@example.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Sup", // Subject line
        text: "Long time no see", // plain text body
    };
    let info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
    res.status(200).send({  status: 1,
                            message: "Email send!!!"
                        })
}

// ================================ Token Service ================================

exports.refreshToken = (req, res, next) => {
    const token = req.cookies[environment.COOKIE_PREFIX + "_LOGIN_INFO"];
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            let dataInfo = {
                authToken: refreshToken.token,
                refreshToken: refreshToken.token,
                expiresIn: refreshToken.expires,
            }
            res.json(dataInfo);
            // res.json(user);
        })
        .catch(next);
}


exports.revokeToken = (req, res, next) => {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies[environment.COOKIE_PREFIX + "_LOGIN_INFO"];
    const ipAddress = req.ip;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    // if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    userService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}
// ================================ End Token Service ================================

// ================================ Helper Functions ================================

async function checkDuplicateEmail(email, next) {
    try {
        let [organization] = await User.getUserByEmail(email, { superadminpermission: true })
        if (organization.length > 0) {
            return { code: 200, message: "success", results: organization }
        } else {
            return { code: 200, message: "success", results: [] }
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => check duplicate email";
        }
        next(error);
    }
};

async function checkDuplicateOrg(org_name, next) {
    try {
        let [organizationname] = await User.getUserByOrgname(org_name, { superadminpermission: true })
        if (organizationname.length > 0) {
            return { code: 200, message: "success", results: organizationname }
        } else {
            return { code: 200, message: "success", results: [] }
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => check duplicate organization_name";
        }
        next(error);
    }
};

function basicDetails(user) {
    const { user_id, user_name, user_email, org_id, role_id } = user;
    let dataInfo = {
        user_id: user_id,
        user_name: user_name,
        user_email: user_email,
        role_id: role_id,
        org_id: org_id,
    };
    return dataInfo;
}

function setTokenCookie(res, token) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        // expires: refreshToken.expires
    };
    res.cookie(environment.COOKIE_PREFIX + "_LOGIN_INFO", token, cookieOptions);
}


// ================================ End Helper Functions ================================



