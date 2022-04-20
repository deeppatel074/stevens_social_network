const multer = require('multer');
const path = require('path');
// var storage = multer.memoryStorage();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/uploads"))
    },
    filename: function (req, file, cb) {
        console.log("file", file)
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
})


var upload = multer({ storage: storage });

module.exports = upload;
