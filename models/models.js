const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uuid = require('uuid').v4;

const packageSchema = new mongoose.Schema({

  uuid: { type: String, required: false, default: uuid() },
  recipient: { type: String, required: true },
  recipientMail: { type: String, required: true },
  carrierName: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  dateRecieved: { type: Date, required: true },
  datePickedUp: { type: Date, required: false, default: null },
  lost: { type: Boolean, required: false, default: false },
  pickedUp: { type: Boolean, required: false, default: false },
  emailsSent: { type: Number, required: false, default: 0 },

});

const recipientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    boxNumber: { type: Number, required: true },
    email: { type: String, required: true },
    idNumber: { type: String, required: true }
});

const formSchema = new mongoose.Schema({
    uuid: { type: String, required: false, default: uuid() },
    employeeName: { type: String, required: true },
    timeStamp: { type: Date, required: false, },
    susTracking: { type: String, required: true },
    reportReason: { type: String, required: true },
    employeeNote: { type: String, required: false, default: Date.now()},
    isResolved: { type: Boolean, default: false },
    packageUUID: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, default: "Jim" },
    password: { type: String, required: true, default: "pass" },
    token: { type: String }
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
  SusForm: mongoose.model("SusForm", formSchema),
};
