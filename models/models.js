const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const packageSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  sender: { type: String, required: true },
  carrierName: { type: String, required: true },
  returnAddress: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  trackingNumber: { type: Number, required: true }
});

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  boxNumber: { type: Number, required: true },
  email: { type: String, required: true },
  idNumber: { type: String, required: true },
  packagesIds: [{ type: String, required: true }],
  employeeNote: { type: String, required: false, default: "NA" },
});

const formSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    timeStamp: { type: Date, required: true },
    susTracking: { type: String, required: true },
    reportReason: { type: String, required: true },
    employeeNote: { type: String, required: false, default: "NA" },
    isResolved: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, default: "Jim" },
    password: { type: String, required: true, default: "pass" }
});
/*userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    } else {
        bcrypt.hash(user.password, 10).then(hashedPassword => {
            user.password = hashedPassword;
            next();

        });


    }
});*/
userSchema.method('comparePassword', function (candidatePassword) {
    const user = this;
    console.log(user)
    console.log(user.password);
    console.log(candidatePassword);
    return bcrypt.compareSync(candidatePassword, user.password);
});

module.exports = {
  Package: mongoose.model("Package", packageSchema),
  Recipient: mongoose.model("recipient", recipientSchema),
  User: mongoose.model("User", userSchema),
};
