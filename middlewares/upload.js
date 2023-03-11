const multer = require('multer');
const path = require('path');
// const { v4 } = require('uuid');

const tempDir = path.join(__dirname, '../', 'temp');

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: multerConfig,
});

module.exports = {
    upload,
};
