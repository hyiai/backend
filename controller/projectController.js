const { Project } = require('../models/projectModel');
const { Company } = require('../models/companyModel');
const mongoose = require('mongoose');
const addProject = async (req, res) => {
  try {
    const {
      project_name,
      scope_description,
      account_manager_name,
      developers,
      deadline,
      working_hours,
      technology,
      project_status,
      project_start_date,
    } = req.body;

    const userId = req.user._id; // Extract userId from token

    // Find the company associated with the logged-in user
    const company = await Company.findOne({ user: userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found for this user.',
      });
    }

    // Check if a project with the same name already exists for the same company
    const existingProject = await Project.findOne({
      project_name,
      companyId: company._id,
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'A project with this name already exists for this company.',
      });
    }

    // Create a new project instance with company details
    const newProject = new Project({
      project_name,
      scope_description,
      account_manager_name,
      developers,
      deadline,
      working_hours,
      technology,
      project_status,
      project_start_date,
      companyId: company._id,
      companyName: company.companyName,
    });

    // Save the project to the database
    await newProject.save();

    // Send a response back
    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      project: newProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project',
      error: error.message,
    });
  }
};

// get all projects
const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Set default limit to 20

    const skip = (page - 1) * limit;

    // Always call countDocuments before fetching the data
    const totalCount = await Project.countDocuments(); // Ensure it's always called

    const projects = await Project.find().skip(skip).limit(limit);

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        error: 'No Projects found',
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalProjects: totalCount,
        },
      });
    }

    return res.status(200).json({
      message: 'Projects retrieved successfully',
      projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProjects: totalCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

//Get Project By Id
const getProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Extract the project ID from the route parameters

    // Check if projectId exists
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required.',
      });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message,
    });
  }
};

// Delete Project By ID
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Extract project ID from route parameters

    // Check if projectId exists
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required.',
      });
    }

    // Find the project and delete it
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
      error: error.message,
    });
  }
};

// Get Projects By Company ID
const getProjectsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Validate companyId
    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Company ID is required.',
      });
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
      });
    }

    // Find projects associated with the companyId
    const projects = await Project.find({ companyId });

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for this company.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully.',
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects.',
      error: error.message,
    });
  }
};

module.exports = {
  addProject,
  getAllProjects,
  getProject,
  deleteProject,
  getProjectsByCompanyId,
};
