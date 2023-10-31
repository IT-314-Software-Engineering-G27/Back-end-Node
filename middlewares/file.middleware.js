const { uploadFile } = require("../services/file.service");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const hex = Buffer.from(Date.now().toString()).toString('hex');
        cb(null, hex);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('File is not an image. Accepted formats: jpeg, jpg, png, gif.'));
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 4 * 1024 * 1024 } });

async function gridFSMiddleware(req, res, next) {
    const file_id = await uploadFile({ file: req.file });
    req.file._id = file_id;
    next();
};

module.exports = {
    upload,
    gridFSMiddleware,
}