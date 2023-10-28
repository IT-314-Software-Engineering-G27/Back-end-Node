const { uploadFile } = require("../services/file.service");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const hex = Buffer.from(Date.now().toString()).toString('hex');
        cb(null, hex);
    }
});

const upload = multer({ storage: storage });

async function gridFSMiddleware(req, res, next) {
    const file_id = uploadFile({ file: req.file });
    req.file._id = file_id;
    next();
};

module.exports = {
    upload,
    gridFSMiddleware,
}