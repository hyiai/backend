const {
  addCompany,
  getCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
} = require('../controller/companyController');
const { UserBase } = require('../models/authModel');
const { Company } = require('../models/companyModel');
const { uploadFileToS3, deleteFileFromS3 } = require('../utils/awsS3'); // Consolidated import
const httpMocks = require('node-mocks-http');

jest.mock('../models/authModel');
jest.mock('../models/companyModel');
jest.mock('../utils/awsS3');
//Add Company Test
describe('Company Controller - addCompany', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      user: { _id: 'mockUserId', email: 'test@example.com' },
      body: {
        companyName: 'Tech Corp',
        summary: 'A tech company',
        location: 'San Francisco',
        phoneNumber: '9876543210',
        businessType: 'Software',
        industryType: 'Technology',
        timeZonePreferences: 'PST',
      },
      files: {
        companyLogo: [
          { originalname: 'logo.jpg', buffer: Buffer.from('mockBuffer') },
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

  it('should return 400 if companyName is not provided', async () => {
    req.body.companyName = null;
    await addCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Company name is required',
    });
  });

  it('should return 404 if user is not found', async () => {
    UserBase.findById.mockResolvedValue(null);

    await addCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should create a new company profile if no existing company profile', async () => {
    UserBase.findById.mockResolvedValue({
      _id: 'mockUserId',
      email: 'test@example.com',
    });
    Company.findOne.mockResolvedValue(null);
    uploadFileToS3.mockResolvedValue('mockCompanyLogoUrl');

    const saveMock = jest.fn();
    Company.mockImplementation(() => ({
      save: saveMock,
    }));

    await addCompany(req, res);

    expect(uploadFileToS3).toHaveBeenCalledWith(
      req.files.companyLogo[0],
      'company-logo/',
    );
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Company Profile created successfully',
      user: expect.any(Object),
    });
  });

  it('should update an existing company profile if company profile exists', async () => {
    UserBase.findById.mockResolvedValue({
      _id: 'mockUserId',
      email: 'test@example.com',
    });
    Company.findOne.mockResolvedValue({
      save: jest.fn(),
    });
    uploadFileToS3.mockResolvedValue('mockCompanyLogoUrl');

    await addCompany(req, res);

    expect(uploadFileToS3).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Company Profile updated successfully',
      user: expect.any(Object),
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate AWS upload error
    uploadFileToS3.mockRejectedValue(new Error('Mock server error'));

    await addCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: 'Mock server error',
    });
  });
});

//Get Company By Id
describe('Company Controller - getCompany', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      user: { _id: 'mockUserId' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if company profile is not found', async () => {
    Company.findOne.mockResolvedValue(null); // Simulating no company profile found

    await getCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Company profile not found',
    });
  });

  it('should return 200 and company profile if found', async () => {
    const mockCompany = {
      _id: 'mockCompanyId',
      companyName: 'Tech Corp',
      summary: 'A tech company',
      location: 'San Francisco',
      phoneNumber: '9876543210',
      businessType: 'Software',
      industryType: 'Technology',
      timeZonePreferences: 'PST',
    };

    Company.findOne.mockResolvedValue(mockCompany); // Simulating a found company profile

    await getCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Company Profile retrieved successfully',
      company: mockCompany,
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate database error
    Company.findOne.mockRejectedValue(new Error('Mock database error'));

    await getCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});

//Delete Company By Id
describe('Company Controller - deleteCompany', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      user: { _id: 'mockUserId' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if company profile is not found', async () => {
    Company.findOneAndDelete.mockResolvedValue(null); // Simulate no company profile found

    await deleteCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Company profile not found',
    });
  });

  it('should return 200 if company profile is successfully deleted', async () => {
    const mockCompany = {
      _id: 'mockCompanyId',
      companyName: 'Tech Corp',
      summary: 'A tech company',
      location: 'San Francisco',
      phoneNumber: '9876543210',
      businessType: 'Software',
      industryType: 'Technology',
      timeZonePreferences: 'PST',
    };

    Company.findOneAndDelete.mockResolvedValue(mockCompany); // Simulate a company profile being deleted

    await deleteCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Company Profile deleted successfully',
    });
  });

  it('should handle server errors gracefully', async () => {
    // Simulate database error
    Company.findOneAndDelete.mockRejectedValue(
      new Error('Mock database error'),
    );

    await deleteCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});

//Get All Compnay
describe('Company Controller - getAllCompanies', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/getCompanies',
      query: {
        page: '1',
        limit: '10',
      },
    });

    res = httpMocks.createResponse();
  });

  it('should return all companies with correct pagination', async () => {
    // Mock data
    const mockCompanies = [
      {
        _id: 'company1',
        companyName: 'Tech Corp 1',
        location: 'City 1',
      },
      {
        _id: 'company2',
        companyName: 'Tech Corp 2',
        location: 'City 2',
      },
    ];

    // Mock Company methods
    Company.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCompanies),
    }));
    Company.countDocuments.mockResolvedValue(50);

    await getAllCompanies(req, res);

    expect(Company.find).toHaveBeenCalledTimes(1);
    expect(Company.countDocuments).toHaveBeenCalledTimes(1);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Companies retrieved successfully',
      companies: mockCompanies,
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalCompanies: 50,
      },
    });
  });

  it('should handle empty company data gracefully', async () => {
    Company.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    }));
    Company.countDocuments.mockResolvedValue(0);

    await getAllCompanies(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      error: 'No companies found',
    });
  });

  it('should handle server errors gracefully', async () => {
    Company.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Mock database error')),
    }));

    await getAllCompanies(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });

  it('should handle pagination with different page and limit values', async () => {
    req.query.page = '2'; // Simulating a different page
    req.query.limit = '5'; // Simulating a different limit

    const mockCompanies = [
      { _id: 'company3', companyName: 'Tech Corp 3', location: 'City 3' },
      { _id: 'company4', companyName: 'Tech Corp 4', location: 'City 4' },
    ];

    Company.find.mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCompanies),
    }));
    Company.countDocuments.mockResolvedValue(50);

    await getAllCompanies(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Companies retrieved successfully',
      companies: mockCompanies,
      pagination: {
        currentPage: 2,
        totalPages: 10, // 50 total companies / 5 limit per page
        totalCompanies: 50,
      },
    });
  });
});

//Update Company By Id
describe('Company Controller - updateCompany', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/companies/:companyId',
      params: { companyId: '60c72b2f9b1d4c001c8e4df6' },
      body: {
        companyName: 'Updated Company Name',
        summary: 'Updated summary',
        location: 'Updated location',
        phoneNumber: '1234567890',
        businessType: 'Updated business type',
        industryType: 'Updated industry type',
        timeZonePreferences: 'Updated time zone preferences',
      },
      files: {
        companyLogo: [
          {
            fieldname: 'companyLogo',
            originalname: 'logo.png',
            buffer: Buffer.from('mock image data'),
          },
        ],
      },
    });

    res = httpMocks.createResponse();
  });

  it('should update the company profile successfully', async () => {
    const mockCompany = {
      _id: '60c72b2f9b1d4c001c8e4df6',
      companyName: 'Original Company Name',
      summary: 'Original summary',
      location: 'Original location',
      phoneNumber: '0987654321',
      businessType: 'Original business type',
      industryType: 'Original industry type',
      timeZonePreferences: 'Original time zone preferences',
      companyLogo: 'old-logo-url',
      save: jest.fn(),
    };

    Company.findById.mockResolvedValue(mockCompany);
    uploadFileToS3.mockResolvedValue('new-logo-url');
    deleteFileFromS3.mockResolvedValue();

    await updateCompany(req, res);

    expect(Company.findById).toHaveBeenCalledWith('60c72b2f9b1d4c001c8e4df6');
    expect(deleteFileFromS3).toHaveBeenCalledWith(
      'old-logo-url',
      'company-logo/',
    );
    expect(uploadFileToS3).toHaveBeenCalledWith(
      req.files.companyLogo[0],
      'company-logo/',
    );
    expect(mockCompany.save).toHaveBeenCalled();

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({
      message: 'Company profile updated successfully',
      company: expect.objectContaining({
        companyName: 'Updated Company Name',
        summary: 'Updated summary',
        location: 'Updated location',
        phoneNumber: '1234567890',
        businessType: 'Updated business type',
        industryType: 'Updated industry type',
        timeZonePreferences: 'Updated time zone preferences',
        companyLogo: 'new-logo-url',
      }),
    });
  });

  it('should return 400 if companyId is invalid', async () => {
    req.params.companyId = 'invalidId';

    await updateCompany(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Invalid company ID' });
  });

  it('should return 404 if the company is not found', async () => {
    Company.findById.mockResolvedValue(null);

    await updateCompany(req, res);

    expect(Company.findById).toHaveBeenCalledWith('60c72b2f9b1d4c001c8e4df6');
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Company profile not found' });
  });

  it('should handle server errors gracefully', async () => {
    Company.findById.mockRejectedValue(new Error('Mock database error'));

    await updateCompany(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({
      error: 'Server error',
      details: 'Mock database error',
    });
  });
});
