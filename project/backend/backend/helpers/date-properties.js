module.exports = {
    addHours: Date.prototype.addHours = function (h) {
        {
            this.setTime(this.getTime() + (h * 60 * 60 * 1000));
            return this;
        }
    },

    minusHours: Date.prototype.minusHours = function (h) {
        {
            this.setTime(this.getTime() - (h * 60 * 60 * 1000));
            return this;
        }
    },

    formatDate: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    },

    dateBetween: function (value1, value2) {
        // expiresIn: "10h" // it will be expired after 10 hours
        //expiresIn: "20d" // it will be expired after 20 days
        //expiresIn: 120 // it will be expired after 120ms
        //expiresIn: "120s" // it will be expired after 120s
        const date1 = new Date(value1);
        const date2 = new Date(value2);
        if (date2 > date1) {
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // console.log(diffTime + " milliseconds");
            // console.log(diffDays + " days");
            return diffDays + 'd';
        }
        return;
    }
};
