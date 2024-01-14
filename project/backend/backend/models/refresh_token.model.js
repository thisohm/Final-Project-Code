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

module.exports = class refresh_token {

    constructor(dataInfo) {
        this.user_id = dataInfo.user_id
        this.token_expires = dataInfo.token_expires
        this.token_create = dataInfo.token_create
        this.token_delete = dataInfo.token_delete
        this.replaced_token = dataInfo.replaced_token 
        this.is_expired = dataInfo.is_expired
        this.is_active = dataInfo.is_active
        this.token = dataInfo.token
    }

    static create(dataInfo) {
        //console.log(dataInfo)
        return db.query(`
            INSERT INTO     refresh_token
            SET             ?`,
            [dataInfo]
        )
    }

    static searchById(user_id) {
        return db.query(`
            SELECT      *
            FROM        refresh_token
            WHERE       user_id = ?`,
            [ user_id ]
        )
    }

    static getByToken(token) {
        return db.query(`
            SELECT      *
            FROM        refresh_token
            WHERE       token = ?`,
            [ token ]
        )
    }

    static getAll() {
        return db.query(`
            SELECT      *
            FROM        refresh_token`
        )
    }

    static update(dataInfo) {
        return db.query(`
            UPDATE      refresh_token
            SET         token_expires = ?,
                        token_create = ?,
                        token_delete = ?,
                        replaced_token = ?,
                        is_expired = ?,
                        is_active = ?,
                        token = ?
            WHERE       user_id = ?`,
            [
                dataInfo.token_expires,
                dataInfo.token_create,
                dataInfo.token_delete,
                dataInfo.replaced_token,
                dataInfo.is_expired,
                dataInfo.is_active,
                dataInfo.token,
                dataInfo.user_id
            ]
        )
    }

    static delete(user_id) {
        return  db.query(`
            DELETE
            FROM        refresh_token
            WHERE       user_id = ?`,
            [ user_id ]
        )
    }
}