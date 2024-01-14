const fileOperation = require("./file-operation");

module.exports = generateFileOperation;

function generateFileOperation() {
    return [
        async (req, res, next) => {
            try {
                let fileName = await fileOperation.generate_name();
                let filePath = await fileOperation.generate_directory(fileName);
                let fileDirectory = `uploads/videos/${fileName.substring(0,1)}/${fileName.substring(1,3)}`
                req.fileDetail = { fileName: fileName, filePath: filePath, fileDirectory: fileDirectory }
                // req.fileDetail = { fileName: fileName, filePath: "uploads/videos" }
                // console.log('filePath => ', filePath);
                // console.log('req.fileDetail => ', req.fileDetail);
                next();
            } catch (err) {
                if (!err.statusCode) {
                    err.statusCode = 500;
                    err.message = "uploadfile ERROR!"
                }
                next(err);
            }
        }
    ];
}