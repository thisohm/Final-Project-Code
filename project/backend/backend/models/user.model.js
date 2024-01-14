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

module.exports = class user {

    constructor(dataInfo) {
        this.user_id = dataInfo?.user_id || ""
        this.org_id = dataInfo?.org_id || ""
        this.role_id = dataInfo?.role_id || ""
        this.name = dataInfo?.name || ""
        this.email = dataInfo?.email || ""
        this.passwordhash = dataInfo?.passwordhash || ""
        this.acc_type = dataInfo?.acc_type || ""
        this.created_timestamp = dataInfo?.created_timestamp || ""
        this.status = dataInfo?.status || 0
        this.profile_pic = dataInfo?.profile_pic || ""
    }

    static create(dataInfo) {
        return db.query(`
            INSERT 
            INTO        user
            SET         ?`,
            [dataInfo]
        )
    }

    static userProfile(user_id) {
        return db.query(`
                SELECT      user.name AS user_name,
                            organization.name AS org_name,
                            user.email AS user_email,
                            role.name AS role_name
                FROM        user
                LEFT JOIN   organization ON
                            organization.org_id = user.org_id
                LEFT JOIN   role ON
                            role.role_id = user.role_id
                WHERE       user.user_id = ?`,
            [user_id]
        )
    }

    static searchByKeyword(search_query) {
        search_query = '%' + search_query + '%'
        return db.query(`
            SELECT      user.name AS user_name,
                        user.email AS email,
                        role.name AS user_role
            FROM        user
            LEFT JOIN   organization ON
                        organization.org_id = user.org_id
            LEFT JOIN   role ON
                        role.role_id = user.role_id
            WHERE       user.email LIKE ? OR
                        user.name LIKE ?;`,
            [search_query, search_query]
        )
    }
    

    static getUser(user_id, user_info) {
        if (user_info.permission == permission_conf.superadmin || 
            user_info.permission == permission_conf.admin) {
            return db.query(`
                    SELECT      user.name AS user_name,
                                user.email AS email,
                                role.name AS user_role
                    FROM        user
                    LEFT JOIN   role ON
                                role.role_id = user.role_id
                    WHERE       user.user_id = ?`,
                [user_id, user_info.org_id]
            )
        } else if (user_info.permission == permission_conf.superadmin || 
                 user_info.permission == permission_conf.admin){
            return db.query(`
                    SELECT      user.name AS user_name,
                                user.email AS email,
                                role.name AS role_name
                    FROM        user
                    LEFT JOIN   role ON 
                                role.role_id = user.role_id
                    WHERE       user.user_id = ?`,
                [user_id]
            )
        }
    }

    static getUserById(user_id, user_info) {
        return db.query(`
                SELECT      *
                FROM        user
                LEFT JOIN   organization ON
                            organization.org_id = user.org_id
                LEFT JOIN   role ON
                            role.role_id = user.role_id
                WHERE       user.user_id = ?`,
            [user_id]
        )
    }

    static getUserByEmail(email, user_info) {
        if (user_info.permission) {
            return db.query(`
            SELECT      user_id, user.name AS user_name,
                        user.email AS user_email, user.role_id,
                        user.profile_pic, user.org_id,
                        user.passwordhash, user.status AS user_status,
                        organization.name AS org_name,
                        user.acc_type
            FROM        user
            LEFT JOIN   organization ON 
                        organization.org_id = user.org_id 
            WHERE       user.email = ? AND
                        user.status = 1`,
                [email]
            )
        } else {
            return db.query(`
            SELECT      user_id, user.name AS user_name,
                        user.email AS user_email, user.role_id,
                        user.profile_pic, user.org_id,
                        user.passwordhash, user.status AS user_status,
                        organization.name AS org_name
            FROM        user
            LEFT JOIN   organization ON 
                        organization.org_id = user.org_id
            WHERE       user.email = ? AND
                        user.status = 1`,
                [email]
            )
        }
    }

    static getUserByOrgname(org_name, user_info) {
        if (user_info.permission) {
            return db.query(`
            SELECT      * 
            FROM        user
            LEFT JOIN   organization ON
                        organization.org_id = user.org_id
            WHERE       organization.name = ? AND
                        organization.status = 1`,
                [org_name]
            )
        } else {
            return db.query(`
            SELECT      * 
            FROM        user
            LEFT JOIN   organization ON
                        organization.org_id = user.org_id
            WHERE       organization.name = ? AND
                        organization.status = 1`,
                [org_name]
            )
        }
    }

    static updateUserRole(user_id, role_id, userInfo) {
        if (userInfo.permission == permission_conf.admin) {
            return db.query(`
                    UPDATE      user
                    SET         role_id = ?
                    WHERE       user_id = ? AND
                                org_id = ?`,
                [role_id, user_id, userInfo.org_id]
            )
        } else if (userInfo.permission == permission_conf.superadmin){
            return db.query(`
                    UPDATE      user
                    SET         role_id = ?
                    WHERE       user_id = ?`,
                [role_id, user_id]
            )
        }
    }

    static deleteUser(user_id, user_info) {
        if (user_info.permission == permission_conf.superadmin || user_info.permission == permission_conf.admin) {
            return db.query(`
                DELETE 
                FROM        user
                WHERE       user.user_id = ?`,
                [user_id]
            )
        } 
    }

    static getUserByOrgID( org_id, permission ) {
        if (permission === permission_conf.admin || permission === permission_conf.member){
            return db.query(`
            SELECT      user.name AS user_name,
                        user.user_id AS user_id,
                        user.email AS email,
                        role.name AS role_name
            FROM        user
            LEFT JOIN   role ON
                        role.role_id = user.role_id
            WHERE       user.org_id = ?`,
                [org_id]
            )
        } else if (permission === permission_conf.superadmin){
            return db.query(`
            SELECT      user.name AS user_name,
                        user.user_id AS user_id,
                        user.email AS email,
                        organization.name AS org_name,
                        role.name AS role_name
            FROM        user
            LEFT JOIN   role ON
                        role.role_id = user.role_id
            LEFT JOIN   organization ON
                        organization.org_id = user.org_id;`,
            )
        }
    }

}
