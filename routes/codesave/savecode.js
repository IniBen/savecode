const express = require('express');
const savecontroller = require('../../controllers/savecontroller');
const multer = require('multer');
const {Storage} = require("../../utility/storefile")


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
    storage: Storage
   }).array('files')

const saverouter = express.Router();


saverouter.post('/save', upload , savecontroller.encryptFolder);


module.exports = saverouter;