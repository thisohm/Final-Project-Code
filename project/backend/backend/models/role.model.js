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

module.exports = class role {

    constructor(dataInfo) {
        this.role_id = dataInfo.role_id
        this.name = dataInfo.name
        this.detail = dataInfo.detail
        this.status = dataInfo.status
        this.created_timestamp = dataInfo.created_timestamp
        this.updated_timestamp = dataInfo.updated_timestamp
    }

    static getRole() {
        return db.query(`
            SELECT    *
            FROM      role`
        )
    }


    static getRoleByID( role_id ) {
        return db.query(`
            SELECT    *
            FROM      role
            WHERE     role_id = ?`,
            [ role_id ])
    }

    static getRoleByEmail( user_email ) {
        return db.query(`
            SELECT    role.name
            FROM      role
            LEFT JOIN   user
            ON          user.role_id = role.role_id
            WHERE     email = ?`,
            [ user_email ])
    }

    static getRoleIdByName( role_name ) {
        return db.query(`
            SELECT    role_id
            FROM      role
            WHERE     role.name = ?`,
            [role_name])
    }

    static getRoleIdByUserID( user_id ) {
        return db.query(`
            SELECT      *
            FROM        role
            LEFT JOIN   user
            ON          user.role_id = role.role_id
            WHERE       user.user_id = ?`,
            [user_id])
    }

    static delete( role_id, userInfo ) {
        if (userInfo.permission === permission_conf.superadmin){
            return db.query(`
            DELETE      
            FROM        role
            WHERE       role_id = ?`,
            [ role_id ])
        }
    }


}