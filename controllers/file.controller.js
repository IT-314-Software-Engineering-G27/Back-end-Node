const { uploadFile, retrieveFile } = require('../services/file.service');
const FileController = {
    get: async (req, res) => {
        const { id } = req.params;
        await retrieveFile({ fileId: id, stream: res });
    },
    post: async (req, res) => {
        const { id } = await uploadFile({ file: req.file });
        res.json({
            message: 'File uploaded successfully',
            fileId: id,
        });
    }
};

module.exports = FileController;