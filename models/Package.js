const mongoose = require("mongoose");
const packageSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    carrierName: { type: String, required: true },
    returnAddress: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    trackingNumber: { type: Number, required: true }







});


module.exports = mongoose.model("Package", packageSchema);