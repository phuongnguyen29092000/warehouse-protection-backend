const mongoose = require("mongoose");
const validator = require("validator");
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
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error(
              "Password must contain at least one letter and one number"
            );
          }
        },
        private: true, // used by the toJSON plugin
      },
    role: {
        type: String,
        default: 'admin'
      }
}, {
    timestamps: true,
});

adminSchema.statics.isEmailTaken = async function(email, excludeUserId) {
    const admin = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!admin;
}

adminSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };

adminSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;