const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    timeStamp: { type: Date, required: true },
    susTracking: { type: String, required: true },
    reportReason: { type: String, required: true },
    employeeNote: { type: String, required: false, default: "NA" },
    isResolved: { type: Boolean, default: false }





});