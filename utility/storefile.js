const multer = require('multer');

const Storage = multer.diskStorage({
    destination: 'codestore',
    filename:(req,file, cb) =>{
        cb(null, Date.now() + file.originalname)
    },
    
});

module.exports = { Storage };