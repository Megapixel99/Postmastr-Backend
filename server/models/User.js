const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, default: "Jim" },
    password: { type: String, required: true, default: "pass" }
});
module.exports = mongoose.model("User", userSchema);