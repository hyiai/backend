const { UserBase } = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const geoip = require('geoip-lite');
const {
  sendResetLinkEmail,
  sendWelcomeEmail,
  sendOtpEmail,
  generateOtp,
  sendPasswordResetSuccessEmail,
} = require('../utils/EmailSender');
const { addToBlacklist } = require('../utils/blacklist');

//create tocken using algorithm HS256 by default
const createToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.SECRET, { expiresIn: '1d' });
};

// Signup user with OTP generation
const signupUser = async (req, res) => {
  const { email, password, confirmPassword, userType } = req.body;

  try {
    if (!confirmPassword) {
      return res.status(400).json({ error: 'Please confirm the password!' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await UserBase.findOne({ email });
    const otp = generateOtp();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    if (existingUser) {
      if (existingUser.isOtpVerified) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      // Update OTP if user exists but is not verified
      existingUser.otp = otp;
      existingUser.otpExpiration = otpExpiration;
      await existingUser.save();
    } else {
      const hash = await bcrypt.hash(password, 10);
      await UserBase.create({
        email,
        password: hash,
        userType,
        otp,
        otpExpiration,
      });
    }

    // Send OTP email
    await sendOtpEmail(email, otp);
    res
      .status(200)
      .json({ message: 'OTP sent successfully. Please verify to continue.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify OTP and complete signup
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserBase.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found!' });
    if (user.isOtpVerified)
      return res.status(400).json({ error: 'OTP already verified!' });
    if (!user.otp || user.otp !== otp)
      return res.status(400).json({ error: 'Invalid OTP!' });
    if (user.otpExpiration < new Date())
      return res.status(400).json({ error: 'OTP expired!' });

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiration = null;

    const token = createToken(user._id, user.email);
    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const mockIp = '8.8.8.8';
    const geoLocation = geoip.lookup(
      ipAddress === '::1' || ipAddress === '127.0.0.1' ? mockIp : ipAddress,
    ) || { country: 'Unknown', city: 'Unknown' };
    const userAgent = req.headers['user-agent'];

    user.jwtToken = token;
    user.ipAddress = ipAddress;
    user.geoLocation = geoLocation;
    user.deviceInfo = userAgent;

    await user.save();
    // Send welcome email after OTP verification
    await sendWelcomeEmail(user.email);
    res.status(200).json({ token, message: 'Signup successful!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is blocked due to failed attempts
    const attemptStatus = handleLoginAttempts(email);

    if (attemptStatus.block) {
      return res.status(429).json({
        error: `Too many attempts. Please try again after 2 hours.`,
      });
    }

    // Attempt to log the user in
    const user = await UserBase.login(email, password);

    // If login is successful, reset the attempts counter
    loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };

    // Create token
    const token = createToken(user._id, user.email);
    // Store or update the JWT token in the user's document
    user.jwtToken = token;
    await user.save();
    req.userEmail = user.email;
    // Extract user data from the token
    // const userId = extractUserDataFromToken(token);
    res.status(200).json({ token, message: 'Successfully logged in' });
  } catch (error) {
    // Increment the login attempts on failure
    incrementLoginAttempts(email);

    res.status(400).json({ error: error.message });
  }
};

// Forgot Password API - Send Reset Link
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Check if the user exists
    const user = await UserBase.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token with the email
    const resetToken = createToken(user._id, user.email); // Pass both _id and email

    // Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send the reset link via email
    await sendResetLinkEmail(user.email, resetLink);

    res.status(200).json({
      message: 'Password reset link has been sent to your email',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: 'Please provide new password and confirm password',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Verify the reset token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const { _id } = decodedToken; // Use _id from decoded token

    // Find the user by _id
    const user = await UserBase.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await sendPasswordResetSuccessEmail(user.email);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

// Function to extract user ID from the token
const extractUserDataFromToken = (token) => {
  const decodedToken = jwt.decode(token); // Decode the token
  if (!decodedToken || !decodedToken._id || !decodedToken.email) {
    throw new Error('Invalid token or missing user data (ID or email)');
  }
  return { _id: decodedToken._id, email: decodedToken.email };
};

//logout function
const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token not provided' });
  }

  try {
    // Verify the token (optional for extra validation)
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const { _id } = decodedToken;

    // Find the user and set jwtToken to null
    const user = await UserBase.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.jwtToken = null;
    await user.save();
    // Add the token to the blacklist (optional)
    addToBlacklist(token);

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

const loginAttempts = {}; // This object will store login attempts by email

// Function to handle login attempts
const handleLoginAttempts = (email) => {
  const currentTime = Date.now();
  const cooldownPeriod = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // If no previous attempt exists for the user, initialize it
  if (!loginAttempts[email]) {
    loginAttempts[email] = { attempts: 0, lastAttempt: currentTime };
  }

  const userAttempts = loginAttempts[email];

  // If the user has exceeded the 3 attempts limit, check cooldown period
  if (
    userAttempts.attempts >= 3 &&
    currentTime - userAttempts.lastAttempt < cooldownPeriod
  ) {
    const waitTime = Math.ceil(
      (cooldownPeriod - (currentTime - userAttempts.lastAttempt)) / 1000,
    );
    return { block: true, waitTime };
  }

  // Reset the attempts if 2 hours have passed since the last attempt
  if (currentTime - userAttempts.lastAttempt >= cooldownPeriod) {
    loginAttempts[email] = { attempts: 0, lastAttempt: currentTime };
  }

  return { block: false };
};

// Function to increment login attempts on failure
const incrementLoginAttempts = (email) => {
  const currentTime = Date.now();
  if (!loginAttempts[email]) {
    loginAttempts[email] = { attempts: 0, lastAttempt: currentTime };
  }
  loginAttempts[email].attempts += 1;
  loginAttempts[email].lastAttempt = currentTime;
};

module.exports = {
  loginUser,
  signupUser,
  verifyOtp,
  forgetPassword,
  resetPassword,
  extractUserDataFromToken,
  logoutUser,
  handleLoginAttempts,
  incrementLoginAttempts,
};
