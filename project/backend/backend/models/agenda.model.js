const db = require("../configs/config-connection");

module.exports = class agenda {

    constructor(dataInfo) {
        this.meeting_id = dataInfo?.meeting_id || ""
        this.agenda_id = dataInfo?.agenda_id || ""
        this.agentopic = dataInfo?.agentopic || ""
        this.agendetail = dataInfo?.agendetail || ""
        this.agentime = dataInfo?.agentime || ""
    }

    static create(dataInfo) {
        return db.query(`
            INSERT
            INTO    agenda
            SET     ?`,
            [dataInfo]
        )
    }

    static delete(meeting_id){
        return db.query(`
            DELETE
            FROM    agenda
            WHERE   meeting_id = ?`,
            [meeting_id]
        )
    }

    static getByMeetId(meeting_id) {
            return db.query(`
                SELECT          *
                FROM            agenda
                WHERE           meeting_id = ?
                ORDER BY        agentime ASC`,
                [meeting_id]
            )
    }

}