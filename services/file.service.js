const mongoose = require('mongoose');
const fs = require('fs');

async function uploadFile({ file }) {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'storage' });
    const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: {
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            encoding: file.encoding,
        }
    });
    return await new Promise((resolve, reject) => {
        fs.createReadStream(file.path).pipe(uploadStream).on('close', () => {
            fs.unlink(file.path, () => {
                resolve(uploadStream.id.toHexString());
            });
        });
        uploadStream.on('error', (error) => {
            reject(error);
        });
    });
};

async function retrieveFile({ fileId, stream }) {
    const _id = new mongoose.Types.ObjectId(fileId);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'storage' });
    const downloadStream = bucket.openDownloadStream(_id);
    return await new Promise((resolve, reject) => {
        downloadStream.pipe(stream).on('close', () => {
            resolve();
        });
        downloadStream.on('error', (error) => {
            reject(error);
        });
    });
};

async function removeFile({ fileId }) {
    const _id = new mongoose.Types.ObjectId(fileId);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'storage' });
    return await new Promise((resolve, reject) => {
        bucket.delete(_id, (error) => {
            if (error)
                return reject(error);
            resolve();
        });
    });
};

module.exports = {
    retrieveFile,
    uploadFile,
    removeFile,
};
