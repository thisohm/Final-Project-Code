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

const Organization = require("../../models/organization.model");
const User = require("../../models/user.model");


exports.create = async (req, res, next) => {
  let { org_name } = req.body
  let { role_id, org_id, permission } = req.user
  let checkOrgname = await checkDuplicateOrg(org_name, next)
  if (checkOrgname.results.length == 0) {
      try {
          //crete organizationInfo
          let organizationInfo = new Organization()
          organizationInfo.package_id = "9dddd907-df36-429b-b541-2ada41757248"     // default 
          organizationInfo.org_id = uuid.v4()
          organizationInfo.name = org_name
          organizationInfo.status = true
          organizationInfo.created_timestamp = new Date(Date.now());
          await Organization.create_org(organizationInfo, {role_id, org_id, permission});
          res.status(200).json({
              status: 1 
          })
      } catch (error) {
          if (!error.statusCode) {
              error.statusCode = 500;
              error.message = "error => 0"
          }
          next(error);
      }
  } else if (checkOrgname.results.length != 0){
      res.status(200).json({
        status: 0
    }) //duplicate org_name
  }
}

exports.update = async (req, res, next) => {
    let { dataInfo } = req.body
    let { permission } = req.user
    try {
        let organizationInfo = await Organization.update(dataInfo[0], { permission });
        if (organizationInfo !== 0){
            res.status(200).json({
                status: "1"
            })
        }
        else {
            res.status(200).json({
                status: "0",
                message: "permisson is false"
            })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => 0"
        }
        next(error);
    }
} 

exports.delete = async (req, res, next) => {
    let { org_name  } = req.body
    let { permission } = req.user
    try {
        let organization = await Organization.getOrganizationByName(org_name, permission);
        if (organization[0].length !== 0){
            await Organization.delete(org_name, { permission });
            if (permission){
                res.status(200).json({
                    status: "1"
                })
            }
            else {
                res.status(200).json({
                    status: "0",
                    message: "permisson is false"
                })
            }
        } else {
            res.status(200).json({
                status: "2",
                message: "No this organization name in table."
            })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "error => You not have a permission."
        }
        next(error);
    }
  } 
  


// ================================ Helper Functions ================================
// async function checkDuplicateEmail(email, next) {
//   try {
//       let [organization] = await User.getUserByEmail(email, { permission: true })
//       if (organization.length > 0) {
//           return { code: 200, message: "success", results: organization }
//       } else {
//           return { code: 200, message: "success", results: [] }
//       }
//   } catch (error) {
//       if (!error.statusCode) {
//           error.statusCode = 500;
//           error.message = "error => check duplicate email";
//       }
//       next(error);
//   }
// };

async function checkDuplicateOrg(org_name, next) {
    try {
        let [organizationname] = await User.getUserByOrgname(org_name, { permission: true })
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

// ================================ End Helper Functions ================================