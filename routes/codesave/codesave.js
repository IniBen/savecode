// const express = require('express');
// const savecontroller = require('../../controllers/savecontroller');



// const saveRouter = express.Router();


// saveRouter.post('/savecode', savecontroller.savecode)


// module.exports = saveRouter;

const express = require('express');
const controller = require('../../controllers/savecontroller');
const model = require('../../models/savecode');
const multer = require('multer');

const saveRouter = express.Router();

const upload = multer({ dest: 'uploads/' }); // Adjust the destination folder as needed
// saveRouter.get('/get', async (req, res) => {
//     try {
//         res.send("I dey here oo")
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

saveRouter.post('/upload', upload.single('folder'), async (req, res) => {
    try {
        // const folderPath = req.body.folderPath;
        const uploadedFolder = req.file.path;

        // Read and compress files in the folder
        const compressedFiles = await model.compressFolder(uploadedFolder);

        // Encrypt the compressed data
        const encryptedCode = controller.encryptCode(
            compressedFiles.toString('utf8'),
            '346AESalgo',
            16
        );

        res.status(200).json({ encryptedCode });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
        console.log(error);
    }
});

saveRouter.post('/decrypt', (req, res) => {
    try {
        const encryptedCode = req.body.encryptedCode;

        // Decrypt the encrypted code
        const decryptedCompressedFiles = controller.decryptCode(
            encryptedCode,
            '346AESalgo',
            16
        );

        // Decompress the data
        const decompressedFiles = model.decompressData(
            Buffer.from(decryptedCompressedFiles, 'utf8')
        );

        res.status(200).json({ decompressedFiles: decompressedFiles.toString('utf8') });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = saveRouter;

