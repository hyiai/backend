const express = require('express');
const verifyToken = require('../middleware/tokenMiddleware');
const {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
  logoutUser,
  verifyOtp,
} = require('../controller/authController');

const router = express.Router();
//login rout
router.post('/sign-in', loginUser);

//Verify Otp
router.post('/verify-otp', verifyOtp);

//signup route
router.post('/sign-up', signupUser);

// Forgot password route
router.post('/forgot-password', forgetPassword);

// Reset password route
router.post('/reset-password', resetPassword);

//Logut User
router.post('/log-out', logoutUser, verifyToken);

module.exports = router;
