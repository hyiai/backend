const express = require('express');
const verifyToken = require('../middleware/tokenMiddleware');
const {
  addProject,
  getAllProjects,
  getProject,
  deleteProject,
  getProjectsByCompanyId,
} = require('../controller/projectController');
const router = express.Router();

//Add company
router.post('/add-project', verifyToken, addProject);

//Get All Projects
router.get('/get-projects', verifyToken, getAllProjects);

//Get Project by Id
router.get('/get-project/:projectId', verifyToken, getProject);

// Delete Project by ID
router.post('/delete-project/:projectId', verifyToken, deleteProject);

// Get Projects by Company ID
router.get(
  '/get-projects-by-company/:companyId',
  verifyToken,
  getProjectsByCompanyId,
);

module.exports = router;
