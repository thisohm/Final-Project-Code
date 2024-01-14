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
const helperDate = require("../helpers/date-properties");

module.exports = class video {

    constructor(dataInfo) {
        this.video_id = dataInfo?.video_id || ""
        this.meeting_id = dataInfo?.meeting_id || ""
        this.user_id = dataInfo?.user_id || ""
        this.payment_id = dataInfo?.payment_id || ""
        this.title = dataInfo?.title || ""
        this.duration = dataInfo?.duration || 0
        this.status = dataInfo?.status || 0
        this.deleted_timestamp = dataInfo?.deleted_timestamp
        this.created_timestamp = dataInfo?.created_timestamp || ""
        this.amount = dataInfo?.amount || ""
        this.video_path = dataInfo?.video_path || ""
        this.subtitle_path = dataInfo?.video_path || ""
        this.audio_path = dataInfo?.video_path || ""
        this.image_path = dataInfo?.video_path || ""
    }

    static create(dataInfo) {
        return db.query(`
            INSERT INTO     video
            SET             ?`,
            [dataInfo])
    }

    //get all-video
    static get() {
        return db.query(`
            SELECT  *
            FROM    video`,
        )
    }

    //get video by meeting_id
    static getVideoByMeetId(meeting_id) {
        return db.query(`
            SELECT  *
            FROM    video
            WHERE   meeting_id = ? `,
            [meeting_id]
        )
    }

    static update(dataInfo, user_id) {
        return db.query(`
        UPDATE  video
        SET     meeting_id = ?,
                title = ?,
                image_path = ?,
                video_path = ?,
                audio_path = ?,
                subtitle_path = ?,
                amount = ?,
                status = ?,
                duration = ?,
                deleted_timestamp = ?
        WHERE   video_id = ?;`,
        [   
            dataInfo.meeting_id,
            dataInfo.title,
            dataInfo.image_path,
            dataInfo.video_path,
            dataInfo.audio_path,
            dataInfo.subtitle_path,
            dataInfo.amount,
            dataInfo.status,
            dataInfo.duration,
            dataInfo.deleted_timestamp,
            dataInfo.video_id,
        ]           
        )
    }


    static permanentDelete(video_id, userInfo) {
        db.query(`
            DELETE
            FROM	    subtitle
            WHERE	    video_id = ?`,
            [video_id]
        )
        db.query(`
            DELETE
            FROM    video
            WHERE	video_id = ? AND
                    user_id = ?;`,
            [video_id, userInfo.user_id]
        )
        return
    }

    //getbyid
    static getVideo(video_id) {
        return db.query(`
            SELECT      *
            FROM        video
            WHERE       video_id = ?;`,
            [video_id]
        )
    }

    //getbyid
    static getVideoById(video_id) {
        return db.query(`
            SELECT      *
            FROM        video
            WHERE       video_id = ? AND
                        status != 0 AND
                        deleted_timestamp IS NULL;`,
            [video_id]
        )
    }

    //getbyid
    static getVideoByIdDeleted(video_id) {
        return db.query(`
            SELECT      *
            FROM        video
            WHERE       video_id = ?;`,
            [video_id]
        )
    }

    //getDeletedbyid
    static getDeletedById(video_id) {
        return db.query(`
            SELECT      *
            FROM        video
            WHERE       video_id = ? AND
                        deleted_timestamp IS NOT NULL;`,
            [video_id]
        )
    }

    //allUsage
    static getSumVideotimeUser(user_id, video_month, video_year){
        video_year = Number(video_year)
        video_month = Number(video_month)
        return db.query(`
            SELECT      COALESCE( SUM(duration), 0 ) AS total_length,
                        COALESCE( COUNT(video_id), 0 ) AS num_video,
                        COALESCE( SUM(amount), 0 ) AS payment
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       user.user_id = ? AND
                        video.deleted_timestamp IS NULL AND
                        YEAR(video.created_timestamp) = ? AND
                        MONTH(video.created_timestamp) = ?`,
            [user_id, video_year, video_month, ]
        );
    }

    //allUsage
    static getSumVideotimeOrg(org_id, video_month, video_year){
        video_year = Number(video_year)
        video_month = Number(video_month)
        return db.query(`
            SELECT      COALESCE( SUM(duration), 0 ) AS total_length,
                        COALESCE( COUNT(video_id), 0 ) AS num_video,
                        COALESCE( SUM(amount), 0 ) AS payment
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       user.org_id = ? AND
                        video.deleted_timestamp IS NULL AND
                        YEAR(video.created_timestamp) = ? AND
                        MONTH(video.created_timestamp) = ?`,
            [org_id, video_year, video_month]
        );
    }

    //searchList
    static getListvideofile(user_id, org_id, sort_by) {
        if (sort_by == "ASC"){
            return db.query(`
                SELECT      video_id, user.name, video.title,
                            video.created_timestamp, video.duration, video.user_id AS is_owner,
                            video_path, video.image_path AS video_screenshot, video.status
                FROM        video
                LEFT JOIN   user ON
                            user.user_id = video.user_id
                LEFT JOIN   organization ON
                            organization.org_id = user.org_id
                WHERE       video.deleted_timestamp IS NULL AND
                            video.status != 0 AND
                            (video.user_id = ? OR user.org_id = ?)
                ORDER BY    video.created_timestamp ASC;`,
                [user_id, org_id]
            )
        } else if (sort_by == "DESC"){
            return db.query(`
                SELECT      video.user_id, video_id, user.name, video.title,
                            video.created_timestamp, video.duration, video.user_id AS is_owner,
                            video_path, video.image_path AS video_screenshot, video.status
                FROM        video
                LEFT JOIN   user ON
                            user.user_id = video.user_id
                LEFT JOIN   organization ON
                            organization.org_id = user.org_id
                WHERE       video.deleted_timestamp IS NULL AND
                            video.status != 0 AND
                            (video.user_id = ? OR user.org_id = ?)
                ORDER BY    video.created_timestamp DESC;`,
                [user_id, org_id]
            )
        }
    }

    //searchListTrash
    static getsearchListTrash(user_id, org_id, sort_by, num_per_page, num_start_page) {
        if (sort_by == "ASC"){
            return db.query(`
                SELECT      video_id, user.name, video.title,
                            video.image_path AS video_screenshot, video.created_timestamp, video.deleted_timestamp,
                            video.duration , video.user_id AS is_owner, video_id AS 'key'
                FROM        video
                LEFT JOIN   user ON
                            user.user_id = video.user_id
                WHERE       video.deleted_timestamp IS NOT NULL AND
                            video.user_id = ? AND
                            user.org_id = ?
                ORDER BY    video.created_timestamp ASC;`,
                [user_id, org_id]
            )
        } else if (sort_by == "DESC"){
            return db.query(`
                SELECT      video_id, user.name, title,
                            video.created_timestamp, duration, deleted_timestamp,
                            video.image_path AS video_screenshot, video.user_id AS is_owner, video_id AS 'key'
                FROM        video
                LEFT JOIN   user ON
                            user.user_id = video.user_id
                WHERE       video.user_id = ? AND
                            user.org_id = ? AND
                            video.deleted_timestamp IS NOT NULL
                ORDER BY    video.created_timestamp DESC;`,
                [user_id, org_id]
            )
        }
    }

    //searchVideo
    static getSearchVideofile(search_query) {
        search_query = '%' + search_query + '%'
        // num_per_page = parseInt(num_per_page)
        // num_start_page = parseInt(num_start_page)
        return db.query(`
            SELECT      video_id, user.name, video.title,
                        video.created_timestamp, video.duration
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       video.deleted_timestamp IS NULL AND
                        video.title LIKE ? OR
                        user.name LIKE ? AND
                        video.status != 0;`,
            [search_query, search_query]
        )
    }
    
    //searchVideoTrash
    static getSearchVideoTrash(user_id, org_id, search_query) {
        search_query = '%' + search_query + '%'
        return db.query(`
            SELECT      video_id, user.name, video.title,
                        video.image_path AS video_screenshot, video.created_timestamp, video.deleted_timestamp,
                        video.duration, video.user_id AS is_owner
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       user.user_id = ? AND
                        user.org_id = ? AND
                        video.deleted_timestamp IS NOT NULL AND
                        video.title LIKE ? OR
                        user.name LIKE ?`,
            [user_id, org_id, search_query, search_query]
        )
    }

    static getDeleteInfo(video_id){
        return db.query(`
            SELECT      video_id, user.name, video.title,
                        video.image_path, video.created_timestamp,
                        video.duration
            FROM        video
            WHERE       video.video_id = ?;`,
            [video_id] 
        );
    }
    

    static  getStatus(video_id){
        return db.query(`
            SELECT      video.status, video.deleted_timestamp
            FROM        video
            WHERE       video.video_id = ?;`,
            [video_id] 
        );
    }
    
    static setRecoverVideo( video_select, userInfo ){
        return db.query(`
            UPDATE      video
            LEFT JOIN   user
            ON          user.user_id = video.user_id
            SET         deleted_timestamp = NULL
            WHERE       user.user_id = ? AND
                        user.org_id = ? AND
                        video_id = ? `,
            [userInfo.user_id, userInfo.org_id, video_select]
            
        );
    }

    static getYearlyusage(user_id, org_id, year){
        return db.query(`
            SELECT      MONTHNAME(video.created_timestamp) AS month,
                        COALESCE( COUNT(video_id),0 ) AS num_video,
                        COALESCE( SUM(duration),0 ) AS total_length,
                        COALESCE( SUM(amount),0 ) AS payment
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       user.user_id = ? AND
                        user.org_id = ? AND
                        YEAR(video.created_timestamp) = ?
            GROUP BY    MONTH(video.created_timestamp)`,
            [user_id, org_id, year]
        );
    }

    static getMonthlyusage(user_id, org_id, month, year){
        return db.query(`
            SELECT      DAY(video.created_timestamp) AS day,
                        COALESCE( COUNT(video_id),0 ) AS num_video,
                        COALESCE( SUM(duration),0 ) AS total_length,
                        COALESCE( SUM(amount),0 ) AS payment
            FROM        video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            WHERE       user.user_id = ? AND
                        user.org_id = ? AND
                        MONTH(video.created_timestamp) = ? AND
                        YEAR(video.created_timestamp) = ?
            GROUP BY    DAY(video.created_timestamp)`,
            [user_id, org_id, month, year]
        );
    }

    static getVideoByStatus(status){
        return db.query(`
            SELECT      video_id AS video_id,
                        video.status AS video_status, video_path,
                        subtitle_path, image_path, audio_path
            FROM        video
            WHERE       video.status = ?`,
            [status]
        );
    }


    //deleteVideo
    static getdeleteFromActive(user_id, org_id, video_id) {
        return db.query(`
            UPDATE      video
            LEFT JOIN   user ON
                        user.user_id = video.user_id
            SET         video.deleted_timestamp = CURRENT_TIMESTAMP
            WHERE       user.user_id = ? AND
                        user.org_id = ? AND
                        video_id = ?`,
            [user_id, org_id, video_id]
        )
    }

    static getUserByVideoID( video_id ) {
        return db.query(`
            SELECT      user_id
            FROM        video 
            WHERE       video_id = ?`,
            [video_id]
        )
    }
}
