const db = require("../configs/config-connection");

module.exports = class meeting {

    constructor(dataInfo) {
        this.meeting_id = dataInfo?.meeting_id || ""
        this.meettype = dataInfo?.meettype || ""
        this.meetapp = dataInfo?.meetapp || ""
        this.location = dataInfo?.location || ""
        this.topic = dataInfo?.topic || ""
        this.meetdate = dataInfo?.meetdate || ""
        this.meettime = dataInfo?.meettime || ""
        this.created_timestamp = dataInfo?.created_timestamp || ""
        this.status = dataInfo?.status || 0
        
    }
    
    static create(dataInfo) {
        return db.query(`
            INSERT
            INTO    meeting
            SET     ?`,
            [dataInfo]
        )
    }

    static edit(dataInfo,meeting_id) {
        return db.query(`
            UPDATE  meeting
            SET     meettype = ?,
                    meetapp = ?,
                    location = ?,
                    topic = ?,
                    meetdate = ?,
                    meettime = ?
            WHERE   meeting_id = ?`,
            [
                dataInfo.meettype,
                dataInfo.meetapp,
                dataInfo.location,
                dataInfo.topic,
                dataInfo.meetdate,
                dataInfo.meettime,
                meeting_id
            ]
        )
    }

    //get all
    static get() {
        return db.query(`
            SELECT  *
            FROM    meeting
            WHERE   status = 1`,
        )
    }

    //get trash
    static getTrash() {
        return db.query(`
            SELECT  *
            FROM    meeting
            WHERE   status = 0`,
        )
    }

    //change status 1 -> 0
    static changeToZero(meeting_id) {
        return db.query(`
            UPDATE  meeting
            SET     status = 0
            WHERE   meeting_id = ?`,
            [meeting_id]
        )
    }

    //change status 0 -> 1
    static changeToOne(meeting_id) {
        return db.query(`
            UPDATE  meeting
            SET     status = 1
            WHERE   meeting_id = ?`,
            [meeting_id]
        )
    }

    static getByMeetId(meeting_id) {
        return db.query(`
            SELECT  *
            FROM    meeting
            WHERE   meeting_id = ?` ,
            [meeting_id]
        )
    }

    static delete(meeting_id) {
        return db.query(`
            DELETE  
            FROM    meeting
            WHERE   meeting_id = ?` ,
            [meeting_id]
        )
    }

}