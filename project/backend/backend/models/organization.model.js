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
const db = require("../configs/config-connection");
const permission_conf = require("../configs/config-role");

module.exports = class organization {

    constructor(dataInfo) {
        this.org_id = dataInfo?.org_id
        this.package_id = dataInfo?.package_id
        this.name = dataInfo?.name
        this.status = dataInfo?.status
        this.created_timestamp = dataInfo?.created_timestamp
        this.updated_timestamp = dataInfo?.updated_timestamp
    }

    static create_org(dataInfo, user_info) {
        if (user_info.permission === permission_conf.superadmin){
            return db.query(`
                INSERT
                INTO        organization
                SET         ?`,
                [dataInfo])
        } else if (user_info.permission === true){
            return db.query(`
                INSERT
                INTO        organization
                SET         ?`,
                [dataInfo])
        }
    }

    static update(dataInfo, userinfo) {
        if (userinfo.permission === permission_conf.superadmin){
            return db.query(`
                UPDATE      organization
                SET         name = ?,
                            status = ?,
                            package_id = ?,
                            updated_timestamp = ?
                WHERE       org_id = ?`,
                [
                    dataInfo.name,
                    dataInfo.status,
                    dataInfo.package_id,
                    dataInfo.updated_timestamp,
                    dataInfo.org_id
                ]
            )
        } else {
            return 0;
        }
    }

    static delete(org_name , userInfo) {
        if (userInfo.permission === permission_conf.superadmin){
            return db.query(`
                DELETE
                FROM        organization
                WHERE       name = ? `,
                [ org_name ]
            )
        }
    }


    static getOrganizationById(org_id, user_info) {
        if (user_info.permission === permission_conf.superadmin || user_info.permission === permission_conf.admin) {
            return db.query(`
                SELECT      *
                FROM        organization
                WHERE       org_id = ?`,
                [org_id]
            )
        } else {
            return db.query(`
                SELECT      *
                FROM        organization
                WHERE       org_id = ? AND
                            organization.status = 1`,
                [org_id]
            )
        }
    }

    static getOrganizationByName(org_name, user_info) {
        if (user_info.permission === permission_conf.superadmin) {
            return db.query(`
                SELECT      *
                FROM        organization
                WHERE       name = ?`,
                [org_name]
            )
        } else {
            return db.query(`
                SELECT      *
                FROM        organization
                WHERE       name = ? AND
                            organization.status = 1`,
                [org_name]
            )
        }
    }

}
