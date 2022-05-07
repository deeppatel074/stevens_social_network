const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/profiles'))
    },
    filename: function (req, file, cb) {
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
});

var bannerStore = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/banners'))
    },
    filename: function (req, file, cb) {
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
});


var upload = multer({ storage: storage });
var bannerUpload = multer({ storage: bannerStore });

module.exports = { upload, bannerUpload };
