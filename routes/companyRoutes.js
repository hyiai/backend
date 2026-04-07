const express = require('express');
const verifyToken = require('../middleware/tokenMiddleware'); // Import the token verification middleware
const {
  addCompany,
  getCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
} = require('../controller/companyController');
const { upload } = require('../utils/awsS3');
const router = express.Router();

//Add company
router.post(
  '/add-company',
  upload.fields([{ name: 'companyLogo', maxCount: 1 }]),
  verifyToken,
  addCompany,
);

//get company
router.get('/get-all-comapies', verifyToken, getAllCompanies);

//delete Companies
router.post('/delete-company/:companyId', verifyToken, deleteCompany);

//get Company by ID
router.get('/get-company/:companyId', verifyToken, getCompany);

//Update company
router.post(
  '/update-company/:companyId',
  upload.fields([{ name: 'companyLogo', maxCount: 1 }]),
  verifyToken,
  updateCompany,
);
module.exports = router;
