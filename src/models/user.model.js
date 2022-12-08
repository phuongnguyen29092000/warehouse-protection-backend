const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
    companyName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String
    },
    active: {
      type: Boolean,
      default: true,
    },
    ratingReputation: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    businessCode : {
      type: String,
      require: true,
      trim: true,
    },
    address: {
      type: Object,
      value: {
        type: String,
      },
      province: {
        type: Number
      },
      district: {
        type: Number
      },
      ward: {
        type: Number
      },
      detail: {
        type: String
      }
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
      default: 'user'
    }
  },   
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
