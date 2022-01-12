const mongoose = require("mongoose");
const packageSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    carrierName: { type: String, required: true },
    returnAddress: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    trackingNumber: { type: Number, required: true }







});
packageSchema.pre('save', function (next) {
    const package = this;
    if (!user.isModified('trackingNumber')) {
        next();
    } else {
        bcrypt.hash(package.trackingNumber, 10).then(hashedtrackingNumber => {
            package.trackingNumber = hashedtrackingNumber;
            next();

        });


    }
});
UserSchema.method('comparePassword', function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
});
module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("Package", packageSchema);