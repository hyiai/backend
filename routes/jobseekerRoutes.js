const express = require('express');
const verifyToken = require('../middleware/tokenMiddleware'); // Import the token verification middleware
const {
  home,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  filterUsers,
} = require('../controller/jobseekerController');
const { upload } = require('../utils/awsS3');
const router = express.Router();

// Home API route (token in Authorization header)
router.get('/home', verifyToken, home);

// Add user details (with support for multiple files)
router.post(
  '/add-user',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'uploadCertificate', maxCount: 1 },
  ]),
  verifyToken,
  addUser,
);

//get all users
router.get('/get-users', verifyToken, getUsers);

//get user by ID
router.get('/get-user/:userId', verifyToken, getUserById);

//deleteUser By ID
router.post('/delete-user/:userId', verifyToken, deleteUser);

// Update User By ID Route
router.post(
  '/update-user/:userId',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 }, // Handle profile picture upload
    { name: 'resume', maxCount: 1 }, // Handle resume upload
  ]),
  verifyToken,
  updateUser,
);

//filter the user
router.post('/filter-user', verifyToken, filterUsers);

module.exports = router;
