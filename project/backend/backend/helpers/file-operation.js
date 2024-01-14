const http = require('http');
const https = require('https');
const fs = require('fs');
const crypto = require("crypto");
const md5 = require('md5');
const rimraf = require("rimraf");


/* ============================= Format File ============================= */
exports.imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.lexFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(lex|LEX)$/)) {
        req.fileValidationError = 'Only type lex files are allowed!';
        return cb(new Error('Only type lex files are allowed!'), false);
    }
    cb(null, true);
};

exports.videoFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(mp4|MP4|wmv|WMV|mov|MOV|wav|WAV|mp3|MP3|m4a|M4A)$/)) {
        req.fileValidationError = 'Only type lex files are allowed!';
        return cb(new Error('Only type lex files are allowed!'), false);
    }
    cb(null, true);
};

// function lsTypeFile(type) {
//     let type = ['lex', 'LEX'];
//     return '';
// }
/* ============================= End Format File ============================= */


module.exports = {
    /* ============================= Download File ============================= */
    /*
    ** This method downloads the file
    ** from the URL specified in the 
    ** parameters 
    */
    download_file: function (url, path) {
        return new Promise((resolve, reject) => {
            try {
                let file = fs.createWriteStream(__basedir + '/' + path);
                https.get(url, function (response) {
                    response.on('data', function (chunk) {
                        file.write(chunk)
                    })
                    response.on('end', function () {
                        console.log('download file completed.')
                        resolve('File download completed.')
                    })
                });
            } catch (err) {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            }
        })
    },
    /* ============================= End Download File ============================= */
    
    generate_name: function() {
        randomString = crypto.randomBytes(11).toString('hex');
        // generateName = md5(randomString);
        // generateFileName = generateName + "-video";
        generateFileName = md5(randomString) + "-orig";
        return new Promise((resolve, reject) => {
            resolve(generateFileName)
        })
    },

    generate_directory: async function(fileName) {
        var firstDir = fileName.substring(0,1);
        var secondDir = fileName.substring(1,3);
        var path = __basedir + `/uploads/videos/${firstDir}/${secondDir}`

        try {
            await fs.promises.mkdir(`./uploads/videos/${firstDir}/${secondDir}`, { recursive: true })
            return new Promise((resolve, reject) => {
                resolve(path)
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    /* ============================= Delete File ============================= */
    delete_dir_file: function(directory) {
        return new Promise((resolve, reject) => {
            try {
                // Async usage:
                // rimraf("/some/directory", function() {
                    // console.log("done");
                // })

                // Sync usage:
                rimraf.sync(directory);
                resolve("File deleted completed.");
            } catch (err) {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
            }
        })
    }

    /* ============================= End Delete File ============================= */
}