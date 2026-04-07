const {
  addProject,
  getAllProjects,
  getProject,
  deleteProject,
  getProjectsByCompanyId,
} = require('../controller/projectController');
const { Company } = require('../models/companyModel');
const { Project } = require('../models/projectModel');
const httpMocks = require('node-mocks-http');

jest.mock('../models/companyModel');
jest.mock('../models/projectModel');

//Add Project
describe('Project Controller - addProject', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      user: { _id: 'mockUserId' },
      body: {
        project_name: 'New Project',
        scope_description: 'Description of the project',
        account_manager_name: 'John Doe',
        developers: ['dev1', 'dev2'],
        deadline: '2025-01-01',
        working_hours: 40,
        technology: ['React'],
        project_status: 'In Progress',
        project_start_date: '2024-01-01',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if company not found for the user', async () => {
    Company.findOne.mockResolvedValue(null); // Simulate no company found

    await addProject(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Company not found for this user.',
    });
  });

  it('should return 400 if a project with the same name already exists for the company', async () => {
    const mockCompany = { _id: 'company-id', companyName: 'Company ABC' };
    Company.findOne.mockResolvedValue(mockCompany); // Simulate company found
    Project.findOne.mockResolvedValue(mockCompany); // Simulate existing project

    await addProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'A project with this name already exists for this company.',
    });
  });

  it('should successfully add a project', async () => {
    const mockCompany = { _id: 'company-id', companyName: 'Company ABC' };
    Company.findOne.mockResolvedValue(mockCompany); // Simulate company found
    Project.findOne.mockResolvedValue(null); // Simulate no existing project

    const saveMock = jest.fn().mockResolvedValue(true); // Mock save to resolve successfully
    Project.mockImplementation(() => ({
      save: saveMock,
      project_name: req.body.project_name,
      companyId: 'company-id',
    }));

    await addProject(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Project added successfully',
      project: expect.objectContaining({
        project_name: 'New Project',
        companyId: 'company-id',
      }),
    });
  });

  it('should handle server errors gracefully', async () => {
    const mockCompany = { _id: 'company-id', companyName: 'Company ABC' };
    Company.findOne.mockResolvedValue(mockCompany); // Simulate company found
    Project.findOne.mockResolvedValue(null); // Simulate no existing project

    // Mock the save method to reject with an error
    const saveMock = jest
      .fn()
      .mockRejectedValue(new Error('Mock database error'));
    Project.mockImplementation(() => ({
      save: saveMock,
    }));

    await addProject(req, res);

    // Verify that the error path is triggered
    expect(saveMock).toHaveBeenCalled(); // Ensure save was called
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to add project',
      error: 'Mock database error',
    });
  });
});
// Get Project By Id
describe('Project Controller - getProject', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/getProject/:projectId',
      params: {
        projectId: 'mockProjectId',
      },
    });

    res = httpMocks.createResponse();
  });

  it('should return project details when project is found', async () => {
    const mockProject = {
      _id: 'mockProjectId',
      project_name: 'Mock Project',
      companyId: 'mockCompanyId',
      companyName: 'Mock Company',
    };

    // Mock Project.findById method
    Project.findById.mockResolvedValue(mockProject);

    await getProject(req, res);

    expect(Project.findById).toHaveBeenCalledWith('mockProjectId');
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Project retrieved successfully',
      project: mockProject,
    });
  });

  it('should return 400 if project ID is not provided', async () => {
    req.params.projectId = ''; // Simulate missing project ID

    await getProject(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Project ID is required.',
    });
  });

  it('should return 404 if project is not found', async () => {
    Project.findById.mockResolvedValue(null); // Simulate no project found

    await getProject(req, res);

    expect(Project.findById).toHaveBeenCalledWith('mockProjectId');
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Project not found',
    });
  });

  it('should handle server errors gracefully', async () => {
    const mockError = new Error('Mock database error');

    // Simulate a database error
    Project.findById.mockRejectedValue(mockError);

    await getProject(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      success: false,
      message: 'Failed to fetch project',
      error: mockError.message,
    });
  });
});
// Delete Project By ID
describe('Project Controller - deleteProject', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      params: { projectId: 'mockProjectId' }, // Simulate project ID in params
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if projectId is not provided', async () => {
    req.params.projectId = undefined; // Simulate missing project ID

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Project ID is required.',
    });
  });

  it('should return 404 if project is not found', async () => {
    Project.findByIdAndDelete.mockResolvedValue(null); // Simulate no project found

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Project not found.',
    });
  });

  it('should return 200 if project is successfully deleted', async () => {
    const mockProject = {
      _id: 'mockProjectId',
      projectName: 'Project X',
      description: 'Description of Project X',
    };

    Project.findByIdAndDelete.mockResolvedValue(mockProject); // Simulate successful deletion

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Project deleted successfully.',
      project: mockProject,
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate database error
    Project.findByIdAndDelete.mockRejectedValue(
      new Error('Mock database error'),
    );

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to delete project.',
      error: 'Mock database error',
    });
  });
});
//Get All Projects
describe('Project Controller - getAllProjects', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/getProjects',
      query: {
        page: '1',
        limit: '10',
      },
    });

    res = httpMocks.createResponse();
  });

  it('should return all projects with correct pagination', async () => {
    // Mock data
    const mockProjects = [
      { _id: 'proj1', name: 'Project One' },
      { _id: 'proj2', name: 'Project Two' },
    ];

    // Mock methods
    Project.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockProjects),
    }));
    Project.countDocuments.mockResolvedValue(20);

    await getAllProjects(req, res);

    expect(Project.find).toHaveBeenCalledTimes(1);
    expect(Project.countDocuments).toHaveBeenCalledTimes(1);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Projects retrieved successfully',
      projects: mockProjects,
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalProjects: 20,
      },
    });
  });

  it('should handle no projects found gracefully', async () => {
    // Mock empty project data
    Project.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // No projects returned
    }));
    Project.countDocuments.mockResolvedValue(0); // Ensure count is mocked

    await getAllProjects(req, res);

    // Check if both methods are called exactly once
    expect(Project.find).toHaveBeenCalledTimes(1);
    expect(Project.countDocuments).toHaveBeenCalledTimes(1); // Ensure it's called

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      error: 'No Projects found',
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProjects: 0,
      },
    });
  });

  it('should handle server errors gracefully', async () => {
    // Mock a rejected promise
    Project.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Mock database error')),
    }));

    await getAllProjects(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
describe('Project Controller - getProjectsByCompanyId', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = {
      params: { companyId: 'mockCompanyId' }, // Simulate companyId in params
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if the company ID is invalid', async () => {
    req.params.companyId = 'invalidCompanyId'; // Simulate invalid company ID

    await getProjectsByCompanyId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Valid Company ID is required.',
    });
  });
});
