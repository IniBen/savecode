const mongoose = require("mongoose");
// const sendMail = require("../");

const Schema = mongoose.Schema;
const saveSchema = new Schema(
    {
        filename: {
            type: String,
            unique: true,
        },
        userId: {
            type: String,
            unique: false,
        },
        filebuffer: {
            type: Buffer,
            unique: true,
        },
    },
    { timestamps: true }
);

const Save = mongoose.model("Savecode", saveSchema);

module.exports = Save;
