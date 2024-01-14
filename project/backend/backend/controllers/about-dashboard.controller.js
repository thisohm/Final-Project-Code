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
const uuid = require("uuid");
const path = require("path");

const Video = require("../models/video.model.js");
const SecToTime = require("../helpers/sec-to-time");

exports.allUsage = async (req, res, next) => {
    let { month, year } = req.body
    let { user_id, org_id } = req.user
    //no require get user_id,org_id from headers
    try {
        let [user_usage] = await Video.getSumVideotimeUser(user_id, month, year);
        user_usage[0].total_length = SecToTime(user_usage[0].total_length);
        let [org_usage] = await Video.getSumVideotimeOrg(org_id, month, year);
        org_usage[0].total_length = SecToTime(org_usage[0].total_length)         
        res.status(200).json({
            user_usage: user_usage[0],
            org_usage: org_usage[0]
        });
    } catch (error) {
        //console.log(error);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "failed"
        }
        next(err);
    }
}

exports.yearlyUsage = async (req, res, next) => {
    let { year } = req.body
    let { user_id, org_id } = req.user
    try {
        let [yearly_usage] = await Video.getYearlyusage(user_id, org_id, year)
        for (let element of yearly_usage) {
            element.total_length = SecToTime(element.total_length)
        }
        res.status(200).json({ yearly_usage: yearly_usage });
    } catch (error) {
        //console.log(error);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "failed"
        }
        next(err);
    }
}

exports.monthlyUsage = async (req, res, next) => {
    let { month, year } = req.body
    let { user_id, org_id } = req.user
    try {
        let [monthly_usage] = await Video.getMonthlyusage(user_id, org_id, month, year)
        for (let element of monthly_usage) {
            element.total_length = SecToTime(element.total_length)
        }
        res.status(200).json({ monthlyUsage: monthly_usage });
    } catch (error) {
        console.log(error);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "failed"
        }
        next(err);
    }
}