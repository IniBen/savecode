// const fs = require('fs');
// const archiver = require('archiver');
// const crypto = require('crypto');

// create user
// async function savecode(req, res) {

//     // Configuration
//     const codeFolderPath = req.body.folder;
//     // const compressedFilePath = 'path/to/compressed/file.zip';
//     const encryptionKey = 'encryption-key';

//     // Create a writable stream to store the compressed folder
//     const compressedOutput = fs.createWriteStream(codeFolderPath);

//     // Create an archiver instance
//     const archive = archiver('zip', {
//         zlib: { level: 9 } // Compression level: 9 (maximum compression)
//     });

//     // Pipe the compressed output to the writable stream
//     archive.pipe(compressedOutput);

//     // Append the entire code folder to the archive
//     archive.directory(codeFolderPath, false);

//     // Finalize the archive
//     archive.finalize();

//     // Wait for the compression to complete
//     compressedOutput.on('close', () => {
//         console.log('Folder compression completed.');

//         // Read the compressed file
//         const compressedData = fs.readFileSync(compressedFilePath);

//         // Encrypt the compressed data
//         const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey);
//         let encryptedData = cipher.update(compressedData, 'binary', 'hex');
//         encryptedData += cipher.final('hex');


//         console.log('Encryption completed.');
//     });
//     let user = new User({
//         folder: encryptedData,
//     });
//     user
//         .save()
//         .then((response) => {
//             res.status(200).json({
//                 message: "file upload successful",
//                 response,
//             });
//         })
//         .catch((error) => {
//             res.status(400).json({
//                 message: error,
//             });
//         });
// }

// module.exports = { savecode };



const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const archiver = require('archiver');
const zlib = require('zlib');
const app = express();
const jszip = require('jszip');
const Save = require("../models/savecode");


app.use(express.json());

// Replace these with your actual encryption keys (should be securely stored).
// const encryptionKey = crypto.randomBytes(32); // 256 bits
// const iv = crypto.randomBytes(16); // Initialization Vector



// exports.encryptFolder = (req, res) => {
//   // Get the folder path from req.body
//   const folderPath = req.files;


//   // Create a new ZIP archive
//   const zip = new jszip();

//   // Read the folder contents
//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading folder contents' });
//     }

//     // Process each file in the folder
//     files.forEach((file) => {
//       const filePath = `${folderPath}/${file}`;

//       // Read the file content
//       fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//           return res.status(500).json({ error: `Error reading file: ${file}` });
//         }

//         // Generate a random encryption key
//         const encryptionKey = crypto.randomBytes(32);

//         // Create an AES cipher object
//         const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);

//         // Encrypt the file content
//         let encryptedData = cipher.update(data, 'utf8', 'hex');
//         encryptedData += cipher.final('hex');

//         // Add the encrypted file to the ZIP archive
//         zip.file(file, encryptedData);

//         // Check if all files have been processed
//         if (Object.keys(zip.files).length === files.length) {
//           // Generate the ZIP file
//           zip.generateAsync({ type: 'nodebuffer' }).then((buffer) => {
//             // You can send the buffer as a response or save it to storage
//             // For this example, we'll send it as a response
//             res.setHeader('Content-Disposition', 'attachment; filename=secured_folder.zip');
//             res.setHeader('Content-Type', 'application/zip');
//             res.setHeader('Content-Length', buffer.length);
//             res.end(buffer);
//           });
//         }
//       });
//     });
//   });
// };


// exports.encryptFolder = (req, res) => {
//   // Get the uploaded files from req.files
//   const files = req.files;


//   console.log('File Object:', files);


//   // Create a new ZIP archive
//   const zip = new jszip();

//   // Process each uploaded file
//   files.forEach((file) => {
//     // Get the file name and content
//     console.log('who are you:', file);

//     const fileName = file.filename;
//     const fileContent = file.buffer;

//     // Generate a random encryption key
//     const encryptionKey = crypto.randomBytes(32);
//     const iv = crypto.randomBytes(16);

//     // Create an AES cipher object
//     const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

//     // Encrypt the file content
//     let encryptedData = cipher.update(fileContent, 'utf8', 'hex');
//     encryptedData += cipher.final('hex');

//     zip.file(`${fileName}.iv`, iv);
//     console.log(`${fileName}.iv`);
//     // Add the encrypted file to the ZIP archive
//     zip.file(fileName, encryptedData);
//   });

//   // Generate the ZIP file
//   zip.generateAsync({ type: 'nodebuffer' }).then((buffer) => {
//     // You can send the buffer as a response or save it to storage
//     // For this example, we'll send it as a response
//     res.setHeader('Content-Disposition', 'attachment; filename=secured_folder.zip');
//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Length', buffer.length);
//     res.send(buffer);
//   });
// };


exports.encryptFolder = (req, res) => {
    // Get the uploaded files from req.files
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    // Create a new ZIP archive
    const zip = new jszip();

    // Function to handle encryption
    const encryptFile = (fileName) => {
        // Generate a random encryption key and IV
        const encryptionKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16); // Initialization Vector

        // Create an AES cipher object with IV
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
        // Encrypt the file content
        const encryptedData = Buffer.concat([cipher.update(fileName), cipher.final()]);

        // console.log('encryptedData is here:', encryptedData)

        // Add the IV and encrypted data to the ZIP archive
        // zip.file(`${fileName}.iv`, iv);
        zip.file(fileName, encryptedData);
    };

    var fileName = "";
    // Process each uploaded file
    files.forEach((file) => {
        // Verify the structure of the file object

        // Get the file name and content
        fileName = file.filename;


        // Verify the fileContent

        // Encrypt and add the file to the ZIP archive
        encryptFile(fileName);
    });

    // Generate the ZIP file
    zip.generateAsync({ type: 'nodebuffer' }).then((buffer) => {
        // You can send the buffer as a response or save it to storage
        // For this example, we'll send it as a response
        res.setHeader('Content-Disposition', 'attachment; filename=secured_folder.zip');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);
        let savecode = new Save({
            Buffer: buffer,
            filename: fileName,
            userId: "24jngw8",
        });
        savecode
            .save()
            .then((response) => {
                res.status(200).json({
                    message: "Code added successfully",
                    response,
                });
            })
            .catch((error) => {
                res.status(400).json({
                    message: error,
                });
            });
    });



};


// Function to handle decryption
// const decryptFile = (fileName, encryptedData) => {
//     // You need the same encryption key and IV used for encryption
//     const encryptionKey = crypto.randomBytes(32);
//     const iv = crypto.randomBytes(16); // Initialization Vector

//     // Create an AES decipher object with IV
//     const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

//     // Decrypt the encrypted data
//     const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

//     return decryptedData;
// };

app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;

    // Retrieve the encrypted data for the given file name from your database
    // For this example, let's assume you have a function to fetch the data
    // Replace 'fetchEncryptedDataFromDatabase' with your actual implementation

    var savedcode = null;

    Save.findOne({ filename }).then((savecode) => {
        if (savecode) {
            res.status(200).json({
                message: "Login successful",
                data: user,
            });
        } else {
            res.status(404).json({
                message: "User not found",
            });
        }
        savedcode = savecode
    })
        .catch((error) => {
            // Handle any potential errors
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        });

    const encryptedData = savedcode;

    if (!encryptedData) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Decrypt the file content
    const decryptedData = decryptFile(filename, encryptedData);

    // Create a new ZIP archive
    const zip = new jszip();
    zip.file(filename, decryptedData);

    // Generate the ZIP file
    zip.generateAsync({ type: 'nodebuffer' }).then((buffer) => {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);
    });
});



