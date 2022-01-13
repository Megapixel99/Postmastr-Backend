const mongoose = require("mongoose");
const recipientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    boxNumber: { type: Number, required: true },
    email: { type: String, required: true },
    idNumber: { type: String, required: true }
});
module.exports = mongoose.model("recipient", recipientSchema);