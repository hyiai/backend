const { UserBase } = require('../models/authModel');
const { Jobseeker } = require('../models/jobseekerModel');
const {
  loginUser,
  signupUser,
  forgetPassword,
  resetPassword,
} = require('./authController');
const {
  uploadFileToS3,
  deleteFileFromS3,
  processAndUploadImage,
} = require('../utils/awsS3');
// Home API route
const home = async (req, res) => {
  try {
    const { email } = req.user;
    res.status(200).json({ message: `Welcome, ${email}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add or Update User Profile
const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      summary,
      phoneNumber,
      location,
      technicalSkills,
      otherSkills,
      experience,
      roles,
      projects,
      education,
      preference,
      socialLinks,
      expectedPrice,
    } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: 'First name and last name are required' });
    }
    // Concatenate fullName from firstName and lastName
    const fullName = `${firstName} ${lastName}`;
    // Handle profile picture upload
    let profilePictureUrls = null;
    if (req.files && req.files.profilePicture) {
      profilePictureUrls = await processAndUploadImage(
        req.files.profilePicture[0],
        'jobseeker-profile/',
        fullName,
      );
    }

    // Handle resume upload
    let resumeUrl = null;
    if (req.files && req.files.resume) {
      resumeUrl = await uploadFileToS3(
        req.files.resume[0],
        'jobseeker-resume/',
      );
    }

    // Handle certification upload
    let certificationUrl = null;
    if (req.files && req.files.uploadCertificate) {
      certificationUrl = await uploadFileToS3(
        req.files.uploadCertificate[0],
        'jobseeker-certification/',
      );
    }
    const userId = req.user._id;

    const user = await UserBase.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the user's existing Jobseeker profile (if any)
    let jobseeker = await Jobseeker.findOne({ user: userId });

    if (!jobseeker) {
      // Create a new Jobseeker profile if it doesn't exist
      const newJobseeker = new Jobseeker({
        user: userId,
        email: user.email,
        firstName,
        lastName,
        fullName,
        summary,
        location,
        phoneNumber,
        profilePicture: profilePictureUrls?.[0],
        resume: resumeUrl,
        technicalSkills,
        otherSkills,
        experience,
        expectedPrice,
        roles,
        projects,
        education,
        uploadCertificate: certificationUrl,
        preference,
        socialLinks,
      });

      await newJobseeker.save();
      return res.status(200).json({
        message: 'Profile created successfully',
        jobseeker: newJobseeker,
      });
    } else {
      // Update existing Jobseeker profile
      jobseeker.firstName = firstName;
      jobseeker.lastName = lastName;
      jobseeker.fullName = fullName;
      jobseeker.email = user.email;
      jobseeker.summary = summary || jobseeker.summary;
      jobseeker.phoneNumber = phoneNumber || jobseeker.phoneNumber;
      jobseeker.location = location || jobseeker.location;
      if (profilePictureUrls) {
        jobseeker.profilePicture = profilePictureUrls[0];
        jobseeker.profilePictureUrls = profilePictureUrls;
      }
      jobseeker.resume = resumeUrl || jobseeker.resume;
      jobseeker.technicalSkills = technicalSkills || jobseeker.technicalSkills;
      jobseeker.otherSkills = otherSkills || jobseeker.otherSkills;
      jobseeker.experience = experience || jobseeker.experience;
      jobseeker.expectedPrice = expectedPrice || jobseeker.expectedPrice;
      jobseeker.roles = roles || jobseeker.roles;
      jobseeker.projects = projects || jobseeker.projects;
      jobseeker.education = education || jobseeker.education;
      if (certificationUrl) jobseeker.uploadCertificate = certificationUrl;
      jobseeker.preference = preference || jobseeker.preference;
      jobseeker.socialLinks = socialLinks || jobseeker.socialLinks;
      await jobseeker.save();
      return res.status(200).json({
        message: 'Profile updated successfully',
        jobseeker,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const users = await Jobseeker.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await Jobseeker.countDocuments();

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers: totalUsers,
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Jobseeker.findById(userId);
    const email = req.email;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      email: user.email,
      userName: user.userName,
      summary: user.summary,
      location: user.location,
      profilePicture: user.profilePicture,
      resume: user.resume,
      technicalSkills: user.technicalSkills,
      otherSkills: user.otherSkills,
      experience: user.experience,
      projects: user.projects,
      education: user.education,
      typeOfJob: user.typeOfJob,
      github: user.github,
      linkedin: user.linkedin,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    // Log error details and respond with 500
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Delete User by ID
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Jobseeker.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Update User By ID
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      fullName,
      summary,
      location,
      technicalSkills,
      otherSkills,
      experience,
      projects,
      education,
      typeOfJob,
      github,
      linkedin,
      userType,
      phoneNumber,
      expectedPrice,
    } = req.body;

    const user = await Jobseeker.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let profilePictureUrl = user.profilePicture || null;

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      // Delete the old profile picture from S3 if it exists
      if (profilePictureUrl) {
        await deleteFileFromS3(profilePictureUrl, 'jobseeker-profile/');
      }
      // Construct full name for image naming
      const fullName = `${user.firstName} ${user.lastName}`;
      // Process and upload the new profile picture
      profilePictureUrl = await processAndUploadImage(
        req.files.profilePicture[0],
        'jobseeker-profile/',
        fullName,
      );
    }

    let resumeUrl = user.resume;
    if (req.files && req.files.resume) {
      // Delete the old resume from S3 if it exists
      if (resumeUrl) {
        await deleteFileFromS3(resumeUrl, 'jobseeker-resume/');
      }
      // Upload the new resume to the "jobseeker-resume/" folder in S3
      resumeUrl = await uploadFileToS3(
        req.files.resume[0],
        'jobseeker-resume/',
      );
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (summary) user.summary = summary;
    if (fullName) user.fullName = fullName;
    if (technicalSkills && Array.isArray(technicalSkills))
      user.technicalSkills = technicalSkills;
    if (otherSkills && Array.isArray(otherSkills))
      user.otherSkills = otherSkills;
    if (experience && Array.isArray(experience)) user.experience = experience;
    if (expectedPrice && Array.isArray(expectedPrice))
      user.expectedPrice = expectedPrice;
    if (projects && Array.isArray(projects)) user.projects = projects;
    if (education && Array.isArray(education)) user.education = education;
    if (typeOfJob) user.typeOfJob = typeOfJob;
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (location) user.location = location;
    if (profilePictureUrl.length > 0)
      user.profilePicture = profilePictureUrl[0];
    if (resumeUrl) user.resume = resumeUrl;
    if (userType) user.userType = userType;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        summary: user.summary,
        location: user.location,
        resume: user.resume,
        technicalSkills: user.technicalSkills,
        otherSkills: user.otherSkills,
        experience: user.experience,
        expectedPrice: user.expectedPrice,
        projects: user.projects,
        education: user.education,
        typeOfJob: user.typeOfJob,
        github: user.github,
        linkedin: user.linkedin,
        profilePicture: user.profilePicture,
        userType: user.userType,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Filter Users by Skills, Type of Job, and Date Range
const filterUsers = async (req, res) => {
  try {
    const {
      skills,
      typeOfJob,
      location,
      createdAtFrom,
      createdAtTo,
      page = 1,
    } = req.body;

    const filter = {};

    if (skills) {
      const skillsArray = skills.split(',');
      const skillFilters = skillsArray.map((skillExpPair) => {
        const [skill, exp] = skillExpPair.split(':');
        return {
          skill: skill.trim(),
          exp: { $gte: Number(exp) },
        };
      });

      filter.technicalSkills = {
        $elemMatch: {
          $or: skillFilters,
        },
      };
    }

    if (typeOfJob) filter.typeOfJob = typeOfJob;
    if (location) filter.location = location;

    if (createdAtFrom && createdAtTo) {
      const startDate = new Date(createdAtFrom);
      const endDate = new Date(createdAtTo);
      const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
      filter.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await Jobseeker.find(filter)
      .skip(skip)
      .limit(limit)
      .select('-password -otp -otpExpiration -__v');

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: 'No users found matching criteria' });
    }

    const totalCount = await Jobseeker.countDocuments(filter);

    res.status(200).json({
      message: 'Filtered users retrieved successfully',
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        totalUsers: totalCount,
      },
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
  home,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  filterUsers,
};
