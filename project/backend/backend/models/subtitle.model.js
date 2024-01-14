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

module.exports = class subtitle {

    constructor(dataInfo) {
        this.video_id = dataInfo.video_id || ""
        this.sub_id = dataInfo.sub_id || ""
        this.text = dataInfo.text || ""
        this.start_time = dataInfo.start_time || 0
        this.end_time = dataInfo.end_time || 0
    }

    static createSubtitle(dataInfo, video_id) {
        return db.query(`
            INSERT INTO     subtitle
            SET             sub_id = ?, text = ?,
                            start_time = ?, end_time = ?,
                            video_id = ?`,
            [   
                dataInfo.sub_id, dataInfo.text, 
                dataInfo.start_time, dataInfo.end_time,
                video_id
            ]
        )
    }

    //findBySubtitle
    static searchByword(user_id, org_id, video_id, keyword) {
        keyword = '%' + keyword + '%';
        return db.query(`
            SELECT      subtitle.video_id, sub_id, text,
                        start_time, end_time
            FROM        subtitle
            LEFT JOIN   video ON
                        video.video_id = subtitle.video_id
            WHERE       subtitle.video_id = ? AND
                        video.status != 0 AND
                        text LIKE ?`,
            [ video_id, keyword]
        )
    }

    //
    static searchSubByVideoId(video_id) {
        return db.query(`
            SELECT      subtitle.video_id, video.video_path, text,
                        sub_id, start_time, end_time
            FROM        subtitle
            LEFT JOIN   video ON
                        video.video_id = subtitle.video_id
            WHERE       subtitle.video_id = ? AND
                        video.deleted_timestamp IS NULL
            ORDER BY    start_time ASC;`,
            [video_id]
        )
    }

    //searchSubByVideoId
    static searchByVideoId(video_id) {
        return db.query(`
            SELECT *
            FROM subtitle
            WHERE video_id = ?`,
            [video_id]
        )
    }
    
    

    static getContentByVideoId(video_id) {
        return db.query(`
            SELECT          *
            FROM            subtitle
            WHERE           video_id = ?
            ORDER BY        start_time ASC`,
            [video_id]
        )
    }

    static getContentByContentId(sub_id) {
        return db.query(`
            SELECT          *
            FROM            subtitle
            WHERE           sub_id = ?
            ORDER BY        start_time ASC`,
            [sub_id]
        )
    }

    static getContentByVideoIdAndContentId(video_id, sub_id) {
        return db.query(`
            SELECT          *
            FROM            subtitle
            WHERE           video_id = ? AND sub_id = ?
            ORDER BY        start_time ASC`,
            //videoTimestamp
            [video_id, sub_id]
        )
    }

    static editSubtitle(dataInfo, video_id) {
        //edit subtitle -> subtitle
        return db.query(`
            UPDATE  subtitle
            SET     text = ?,
                    start_time = ?,
                    end_time = ?
            WHERE   sub_id = ? AND
                    video_id = ?`,
            [
                dataInfo.text,
                dataInfo.start_time,
                dataInfo.end_time,
                dataInfo.sub_id,
                video_id
            ]
        )
    }

    static delete(sub_id, video_id) {
        return db.query(`
            DELETE
            FROM        subtitle
            WHERE       sub_id = ? AND
                        video_id = ?`,
            [sub_id, video_id]
        )
    }

    static checkContentIdExists(sub_id) {
        return db.query(`
        SELECT EXISTS (
            SELECT  1
            FROM    subtitle
            WHERE   sub_id=?
        ) AS value;`,
            [sub_id]
        )
    }

}