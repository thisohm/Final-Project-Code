const pdf = require('html-pdf');
const ejs = require('ejs')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const path = require('path');
const DbAddress = require('../models/DbAddress.model');
const DbUser = require('../models/DbUser.model');
const DbVideo = require('../models/DbVideo.model');
const DbPackage = require('../models/DbPackage.model');


// https://dev.to/abdulrehman06/generating-custom-html-invoices-which-also-include-images-and-convert-them-to-pdf-1emm
exports.generateInvoicePDF = async (req, res, next) => {
    let { permission, organizationId, user_id } = req.user

    try {
        let invoiceTitle = 'TASANA';
        let currentMonth = new Date().getMonth()
        let currentYear = new Date().getFullYear()
        let currentDueDate = new Date(currentYear, currentMonth + 1, 0);

        let [informationData] = await DbAddress.searchByuser_id(user_id);
        let [userData] = await DbUser.getUserById(user_id, { permission, organizationId })

        let [allVideoInfo] = await DbVideo.allDuration(user_id)
        let [filterByMonthAndYear] = await DbVideo.durationByMonthAndYear(user_id, currentMonth + 1, currentYear)
        let [packageInfo] = await DbPackage.getPackageByOrganizationId({ organizationId, permission })

        let numberOfFile = 0
        let videoDuration = 0
        filterByMonthAndYear.forEach(result => {
            videoDuration += result.videoDuration
            numberOfFile++
        })

        let paymentInfo = {
            numberOfFile: numberOfFile || 0,
            videoDuration: videoDuration || 0,
            allNumberOfFile: allVideoInfo[0].numberOfFile || 0,
            allVideoDuration: allVideoInfo[0].allVideoDuration || 0,
            packagePricePerMinute: packageInfo[0].packagePricePerMinute || 0
        }

        let dateInfo = {
            dateOfInvoice: new Date().toLocaleDateString(),
            dueDate: currentDueDate.toLocaleDateString(),
        }

        if (informationData.length > 0 && userData.length > 0) {
            let userInfo = {
                fullName: (informationData[0].firstName + '  ' + informationData[0].lastName).toString(),
                address: (informationData[0].address || '').toString(),
                city: (informationData[0].city || '').toString(),
                postalCode: (informationData[0].postalCode || '').toString(),
                phoneNumber: (informationData[0].phoneNumber || '').toString(),
                email: (userData[0].userEmail || '').toString(),
            }

            const html = await ejs.renderFile(path.join(__dirname, '../views/template-invoice.ejs'), { userInfo, dateInfo, paymentInfo, invoiceTitle }, { async: true })
            // const options = { format: 'A4' };
            const options = { format: 'Letter' };
            const file = { content: html };

            // For Test Preview
            // res.render("template-invoice.ejs", { userInfo, dateInfo, paymentInfo, invoiceTitle });

            // ================================= if you want to send email then use below code =================================
            pdf.create(html, options).toBuffer(function (err, buffer) { // PDF file save in PDF folder 
                if (err) {
                    console.log(`err  :${err}`)
                } else {
                    // utility.SendEmailNotification('your@email', 'Monthly Bill Statement', 'your bill', buffer, 'Monthly_Bill_Statement.pdf').then((result) => {
                    //     console.log(` send successfully   `)
                    // }).catch((err) => {
                    //     console.log(`err  `)
                    // });
                    console.log(`file buffer  genrated successfullt  `) //  you can wrinte your email send code here 
                    res.writeHead(200, {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "attachment"
                    }).end(buffer);
                }
            });

            // htmlToPdf.generatePdf(file, options).then(pdfBuffer => {
            //     res.writeHead(200, {
            //         "Content-Type": "application/pdf",
            //         "Content-Disposition": "attachment"
            //     }).end(pdfBuffer);
            // }).catch((err) => {
            //     console.log(err)
            //     next(err)
            // })
        } else {
            res.status(200).json({ message: "failed: no data" })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }

};