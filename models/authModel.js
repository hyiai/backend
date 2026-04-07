const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;
// Base schema for common fields (email, password, otp, etc.)
const userBaseSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['Talent', 'company', 'accountManager', 'admin'],
      default: 'Talent',
      require: false,
    },
    ipAddress: {
      type: String, // Store the IP address
      required: false,
    },
    geoLocation: {
      type: Object, // Store geolocation data as an object
      required: false,
    },
    deviceInfo: {
      type: String, // Store user agent or parsed device info
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiration: {
      type: Date,
      required: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1, 2],
    },
    jwtToken: {
      type: String, // Add jwtToken field
      required: false,
    },
  },
  { timestamps: true, collection: 'users' },
);

//static signup method
userBaseSchema.statics.signup = async function (email, password, userType) {
  //validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, userType });
  return user;
};

// static login method
userBaseSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }
  return user;
};

// Method to update password
userBaseSchema.methods.updatePassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  this.password = hash;
  await this.save();
};

const UserBase = mongoose.model('UserBase', userBaseSchema);
module.exports = { UserBase };
