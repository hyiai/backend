const {
  addUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  filterUsers,
} = require('../controller/jobseekerController');
const { UserBase } = require('../models/authModel');
const { Jobseeker } = require('../models/jobseekerModel');
const {
  processAndUploadImage,
  uploadFileToS3,
  deleteFileFromS3,
} = require('../utils/awsS3');
const httpMocks = require('node-mocks-http');

jest.mock('../models/authModel');
jest.mock('../models/jobseekerModel.js');
jest.mock('../utils/awsS3');
jest.mock('../utils/awsS3', () => ({
  processAndUploadImage: jest.fn(),
  uploadFileToS3: jest.fn(),
  deleteFileFromS3: jest.fn(),
}));

// Add users Test
describe('Jobseeker Controller - addUser', () => {
  let req, res;
  beforeEach(() => {
    // Mock console.error to suppress output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      user: { _id: 'mockUserId', email: 'test@example.com' },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        summary: 'Software Engineer',
        phoneNumber: '1234567890',
        location: 'New York',
        technicalSkills: ['JavaScript', 'Node.js'],
        otherSkills: ['Leadership'],
        experience: '5 years',
        roles: ['Developer'],
        projects: ['Project A'],
        education: ['B.Sc. in Computer Science'],
        preference: 'Remote',
        socialLinks: ['https://github.com/johndoe'],
      },
      files: {
        profilePicture: [
          { originalname: 'profile.jpg', buffer: Buffer.from('mockBuffer') },
        ],
        resume: [
          { originalname: 'resume.pdf', buffer: Buffer.from('mockBuffer') },
        ],
        uploadCertificate: [
          { originalname: 'cert.pdf', buffer: Buffer.from('mockBuffer') },
        ],
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

  it('should return 400 if firstName or lastName is not provided', async () => {
    req.body.firstName = null;
    await addUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'First name and last name are required',
    });
  });

  it('should return 404 if user is not found', async () => {
    UserBase.findById.mockResolvedValue(null);

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should create a new profile if no existing jobseeker profile', async () => {
    UserBase.findById.mockResolvedValue({
      _id: 'mockUserId',
      email: 'test@example.com',
    });
    Jobseeker.findOne.mockResolvedValue(null);
    processAndUploadImage.mockResolvedValue(['mockProfileUrl']);
    uploadFileToS3.mockResolvedValue('mockResumeUrl');

    const saveMock = jest.fn();
    Jobseeker.mockImplementation(() => ({
      save: saveMock,
    }));

    await addUser(req, res);

    expect(processAndUploadImage).toHaveBeenCalledWith(
      req.files.profilePicture[0],
      'jobseeker-profile/',
      'John Doe',
    );
    expect(uploadFileToS3).toHaveBeenCalledWith(
      req.files.resume[0],
      'jobseeker-resume/',
    );
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Profile created successfully',
      jobseeker: expect.any(Object),
    });
  });

  it('should update an existing profile if jobseeker profile exists', async () => {
    UserBase.findById.mockResolvedValue({
      _id: 'mockUserId',
      email: 'test@example.com',
    });
    Jobseeker.findOne.mockResolvedValue({
      save: jest.fn(),
    });
    processAndUploadImage.mockResolvedValue(['mockProfileUrl']);
    uploadFileToS3.mockResolvedValue('mockResumeUrl');

    await addUser(req, res);

    expect(processAndUploadImage).toHaveBeenCalled();
    expect(uploadFileToS3).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Profile updated successfully',
      jobseeker: expect.any(Object),
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate AWS upload error
    uploadFileToS3.mockRejectedValue(new Error('Mock server error'));
    processAndUploadImage.mockRejectedValue(new Error('Mock server error'));

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: 'Mock server error',
    });
  });
});
//Update user Test
describe('Jobseeker Controller - updateUser', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest({
      method: 'PUT',
      url: '/api/updateUser/:userId',
      params: { userId: 'mockUserId' },
      body: {
        firstName: 'Jane',
        lastName: 'Doe',
        summary: 'Senior Developer',
      },
      files: {
        profilePicture: [
          { originalname: 'profile.jpg', buffer: Buffer.from('mockBuffer') },
        ],
        resume: [
          { originalname: 'resume.pdf', buffer: Buffer.from('mockBuffer') },
        ],
      },
    });

    res = httpMocks.createResponse();
  });

  it('should return 404 if user is not found', async () => {
    Jobseeker.findById.mockResolvedValue(null);

    await updateUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'User not found' });
  });

  it('should update user details successfully', async () => {
    Jobseeker.findById.mockResolvedValue({
      _id: 'mockUserId',
      profilePicture:
        'https://s3.amazonaws.com/jobseeker-profile/old-profile.jpg',
      resume: 'https://s3.amazonaws.com/jobseeker-resume/old-resume.pdf',
      save: jest.fn(),
    });

    processAndUploadImage.mockResolvedValue([
      'https://s3.amazonaws.com/jobseeker-profile/new-profile.jpg',
    ]);
    uploadFileToS3.mockResolvedValue(
      'https://s3.amazonaws.com/jobseeker-resume/new-resume.pdf',
    );
    deleteFileFromS3.mockResolvedValue(true);

    await updateUser(req, res);

    expect(deleteFileFromS3).toHaveBeenCalledWith(
      'https://s3.amazonaws.com/jobseeker-profile/old-profile.jpg',
      'jobseeker-profile/',
    );
    expect(deleteFileFromS3).toHaveBeenCalledWith(
      'https://s3.amazonaws.com/jobseeker-resume/old-resume.pdf',
      'jobseeker-resume/',
    );
    expect(processAndUploadImage).toHaveBeenCalled();
    expect(uploadFileToS3).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      message: 'User updated successfully',
      user: expect.any(Object),
    });
  });

  it('should handle file upload errors gracefully', async () => {
    Jobseeker.findById.mockResolvedValue({
      _id: 'mockUserId',
      profilePicture:
        'https://s3.amazonaws.com/jobseeker-profile/old-profile.jpg',
      resume: 'https://s3.amazonaws.com/jobseeker-resume/old-resume.pdf',
      save: jest.fn(),
    });

    uploadFileToS3.mockRejectedValue(new Error('Mock file upload error'));

    await updateUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock file upload error',
    });
  });

  it('should handle database errors gracefully', async () => {
    Jobseeker.findById.mockRejectedValue(new Error('Mock database error'));

    await updateUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
//Delete User By ID Test
describe('Jobseeker Controller - deleteUser', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/deleteUser/:userId',
      params: { userId: 'mockUserId' },
    });

    res = httpMocks.createResponse();
  });

  it('should return 404 if user is not found', async () => {
    // Mock the Jobseeker.findById method to return null (user not found)
    Jobseeker.findById.mockResolvedValue(null);

    await deleteUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'User not found' });
  });

  it('should delete the user successfully', async () => {
    // Mock the Jobseeker.findById method to return a user object
    Jobseeker.findById.mockResolvedValue({
      _id: 'mockUserId',
      deleteOne: jest.fn(), // Mock the deleteOne method
    });

    await deleteUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'User deleted successfully',
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate a database error when calling Jobseeker.findById
    Jobseeker.findById.mockRejectedValue(new Error('Mock database error'));

    await deleteUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
//Get User By Id Test
describe('Jobseeker Controller - getUserById', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/getUserById/:userId',
      params: { userId: 'mockUserId' },
      email: 'test@example.com', // Mock email
    });

    res = httpMocks.createResponse();
  });

  it('should return 404 if user is not found', async () => {
    // Mock the Jobseeker.findById method to return null (user not found)
    Jobseeker.findById.mockResolvedValue(null);

    await getUserById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'User not found' });
  });

  it('should return the user data successfully', async () => {
    // Mock the Jobseeker.findById method to return a user object
    Jobseeker.findById.mockResolvedValue({
      _id: 'mockUserId',
      email: 'test@example.com',
      userName: 'John Doe',
      summary: 'Software Engineer',
      location: 'New York',
      profilePicture: 'https://s3.amazonaws.com/jobseeker-profile/profile.jpg',
      resume: 'https://s3.amazonaws.com/jobseeker-resume/resume.pdf',
      technicalSkills: ['JavaScript', 'Node.js'],
      otherSkills: ['Leadership'],
      experience: '5 years',
      projects: ['Project A'],
      education: ['B.Sc. in Computer Science'],
      typeOfJob: 'Remote',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      userType: 'Jobseeker',
      phoneNumber: '1234567890',
    });

    await getUserById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      email: 'test@example.com',
      userName: 'John Doe',
      summary: 'Software Engineer',
      location: 'New York',
      profilePicture: 'https://s3.amazonaws.com/jobseeker-profile/profile.jpg',
      resume: 'https://s3.amazonaws.com/jobseeker-resume/resume.pdf',
      technicalSkills: ['JavaScript', 'Node.js'],
      otherSkills: ['Leadership'],
      experience: '5 years',
      projects: ['Project A'],
      education: ['B.Sc. in Computer Science'],
      typeOfJob: 'Remote',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      userType: 'Jobseeker',
      phoneNumber: '1234567890',
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate a database error when calling Jobseeker.findById
    Jobseeker.findById.mockRejectedValue(new Error('Mock database error'));

    await getUserById(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
//GetAllUser Test
describe('Jobseeker Controller - getUsers', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/getUsers',
      query: {
        page: '1',
        limit: '10',
      },
    });

    res = httpMocks.createResponse();
  });

  it('should return all users with correct pagination', async () => {
    // Mock data
    const mockUsers = [
      {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        summary: 'Software Engineer',
      },
      {
        _id: 'user2',
        firstName: 'Jane',
        lastName: 'Doe',
        summary: 'Data Scientist',
      },
    ];

    // Mock Jobseeker methods
    Jobseeker.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockUsers),
    }));
    Jobseeker.countDocuments.mockResolvedValue(50);

    await getUsers(req, res);

    expect(Jobseeker.find).toHaveBeenCalledTimes(1);
    expect(Jobseeker.countDocuments).toHaveBeenCalledTimes(1);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      currentPage: 1,
      totalPages: 5,
      totalUsers: 50,
      users: mockUsers,
    });
  });

  it('should handle empty user data gracefully', async () => {
    Jobseeker.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    }));
    Jobseeker.countDocuments.mockResolvedValue(0);

    await getUsers(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalUsers: 0,
      users: [],
    });
  });

  it('should handle server errors gracefully', async () => {
    Jobseeker.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Mock database error')),
    }));

    await getUsers(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
//FilterUser Test
describe('Jobseeker Controller - filterUsers', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue([]),
    };

    Jobseeker.find = jest.fn().mockReturnValue(mockQuery);
    Jobseeker.countDocuments = jest.fn().mockResolvedValue(0);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  test('should return filtered users successfully', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ];

    Jobseeker.find().select.mockResolvedValue(mockUsers);
    Jobseeker.countDocuments.mockResolvedValue(30);

    mockRequest.body = {
      skills: 'JavaScript:3,Python:2',
      typeOfJob: 'Full-time',
      location: 'New York',
      createdAtFrom: '2023-01-01',
      createdAtTo: '2023-12-31',
      page: 1,
    };

    await filterUsers(mockRequest, mockResponse);

    expect(Jobseeker.find).toHaveBeenCalledWith(expect.any(Object));
    expect(Jobseeker.find().skip).toHaveBeenCalledWith(0);
    expect(Jobseeker.find().limit).toHaveBeenCalledWith(20);
    expect(Jobseeker.find().select).toHaveBeenCalledWith(
      '-password -otp -otpExpiration -__v',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Filtered users retrieved successfully',
      users: mockUsers,
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalUsers: 30,
      },
    });
  });

  test('should handle no users found', async () => {
    await filterUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'No users found matching criteria',
    });
  });

  test('should handle server error', async () => {
    const errorMessage = 'Database error';
    Jobseeker.find().select.mockRejectedValue(new Error(errorMessage));

    await filterUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: errorMessage,
    });
  });

  test('should handle pagination correctly', async () => {
    Jobseeker.find().select.mockResolvedValue([{ id: '1', name: 'User 1' }]);
    Jobseeker.countDocuments.mockResolvedValue(100);

    mockRequest.body = { page: 3 };

    await filterUsers(mockRequest, mockResponse);

    expect(Jobseeker.find().skip).toHaveBeenCalledWith(40); // (page - 1) * limit = (3 - 1) * 20
    expect(Jobseeker.find().limit).toHaveBeenCalledWith(20);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: {
          currentPage: 3,
          totalPages: 5,
          totalUsers: 100,
        },
      }),
    );
  });
});
