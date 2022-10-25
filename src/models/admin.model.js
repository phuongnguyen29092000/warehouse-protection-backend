const mongoose = require("mongoose");
const validator = require("validator");
const roles = require('../config/roles');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    photoUrl: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
});

adminSchema.statics.isEmailTaken = async function(email, excludeUserId) {
    const admin = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!admin;
}

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;