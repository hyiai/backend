const { UserBase } = require('../models/authModel');
const { Company } = require('../models/companyModel'); // Correct import
const {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
} = require('../controller/authController');
const mongoose = require('mongoose');
const { uploadFileToS3, deleteFileFromS3 } = require('../utils/awsS3');

// Add or Update Company Profile
const addCompany = async (req, res) => {
  try {
    const {
      companyName,
      summary,
      location,
      phoneNumber,
      businessType,
      industryType,
      timeZonePreferences,
    } = req.body;

    // Check if companyName is provided
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const userId = req.user._id; // Extract userId from token
    const user = await UserBase.findById(userId); // Find user in UserBase

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Handle Company logo upload
    let companylogoUrl = null;
    if (req.files && req.files.companyLogo) {
      companylogoUrl = await uploadFileToS3(
        req.files.companyLogo[0],
        'company-logo/',
      );
    }
    // Check if user already has a company profile
    let company = await Company.findOne({ user: userId });

    if (!company) {
      // Create a new Company profile if it doesn't exist
      const newCompany = new Company({
        user: userId,
        email: user.email,
        companyName,
        summary,
        location,
        companyLogo: companylogoUrl,
        phoneNumber,
        businessType,
        industryType,
        timeZonePreferences,
      });

      await newCompany.save();
      return res.status(201).json({
        message: 'Company Profile created successfully',
        user: newCompany,
      });
    } else {
      // Update Company profile if it already exists
      company.companyName = companyName;
      company.email = user.email;
      company.summary = summary || company.summary;
      company.location = location || company.location;
      if (companylogoUrl) {
        company.companyLogo = companylogoUrl;
      }
      company.phoneNumber = phoneNumber || company.phoneNumber;
      company.businessType = businessType || company.businessType;
      company.industryType = industryType || company.industryType;
      company.timeZonePreferences =
        timeZonePreferences || company.timeZonePreferences;

      await company.save();
      return res.status(200).json({
        message: 'Company Profile updated successfully',
        user: company,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get Company Profile by ID
const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const company = await Company.findOne({ user: userId });

    if (!company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    return res.status(200).json({
      message: 'Company Profile retrieved successfully',
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Delete Company Profile
const deleteCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const company = await Company.findOneAndDelete({ user: userId });

    if (!company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    return res.status(200).json({
      message: 'Company Profile deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get all Companies  with Pagination
const getAllCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Set default limit to 20

    const skip = (page - 1) * limit;
    const companies = await Company.find().skip(skip).limit(limit);

    if (!companies || companies.length === 0) {
      return res.status(404).json({ error: 'No companies found' });
    }
    const totalCount = await Company.countDocuments();

    // Return paginated companies
    return res.status(200).json({
      message: 'Companies retrieved successfully',
      companies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCompanies: totalCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

//Update COmpnay By Id
const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params; // Get companyId from the URL params
    const {
      companyName,
      summary,
      location,
      phoneNumber,
      businessType,
      industryType,
      timeZonePreferences,
    } = req.body;

    // Validate that companyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    // Find the company by companyId
    let company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    let companylogoUrl = company.companyLogo;
    if (req.files && req.files.companyLogo) {
      // Delete the old profile picture from S3 if it exists
      if (companylogoUrl) {
        await deleteFileFromS3(companylogoUrl, 'company-logo/');
      }
      // Upload the new profile picture to the "jobseeker-profile/" folder in S3
      companylogoUrl = await uploadFileToS3(
        req.files.companyLogo[0],
        'company-logo/',
      );
    }

    // Update the company details
    company.companyName = companyName || company.companyName;
    company.summary = summary || company.summary;
    company.location = location || company.location;
    company.companyLogo = companylogoUrl || company.companyLogo;
    company.phoneNumber = phoneNumber || company.phoneNumber;
    company.businessType = businessType || company.businessType;
    company.industryType = industryType || company.industryType;
    company.timeZonePreferences =
      timeZonePreferences || company.timeZonePreferences;

    // Save the updated company profile
    await company.save();

    return res.status(200).json({
      message: 'Company profile updated successfully',
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
  addCompany,
  getCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
};
