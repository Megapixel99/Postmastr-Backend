const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, default: "Jim" },
    password: { type: String, required: true, default: "pass" }
});
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    } else {
        bcrypt.hash(user.password, 10).then(hashedPassword => {
            user.password = hashedPassword;
            next();

        });


    }
});
UserSchema.method('comparePassword', function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
});
module.exports = mongoose.model("User", userSchema);