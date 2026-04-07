const companySchema = require('../schema/company');

const companyOptions = {
  components: {
    schemas: {
      Company: companySchema,
    },
  },
  paths: {
    // Add or Update Company Profile
    '/add-company': {
      post: {
        tags: ['Company Management'],
        summary: 'Add or Update Company Profile',
        description:
          'Creates a new company profile or updates an existing one for the authenticated user.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Company',
              },
              example: {
                companyName: 'Tech Innovators Pvt Ltd',
                userType: 'company',
                summary:
                  'We are a tech company specializing in AI and ML solutions.',
                location: 'New York, USA',
                companyLogo: 'https://example.com/uploads/logo.png',
                phoneNumber: 1234567890,
                businessType: 'Software Development',
                industryType: 'Information Technology',
                timeZonePreferences: 'GMT+5:30',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Company profile created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/Company' },
                  },
                },
                example: {
                  message: 'Company profile created successfully',
                  user: {
                    companyName: 'Tech Innovators Pvt Ltd',
                    userType: 'company',
                    summary:
                      'We are a tech company specializing in AI and ML solutions.',
                    location: 'New York, USA',
                    companyLogo: 'https://example.com/uploads/logo.png',
                    phoneNumber: 1234567890,
                    businessType: 'Software Development',
                    industryType: 'Information Technology',
                    timeZonePreferences: 'GMT+5:30',
                  },
                },
              },
            },
          },
          200: {
            description: 'Company profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/Company' },
                  },
                },
                example: {
                  message: 'Company profile updated successfully',
                  user: {
                    companyName: 'Tech Innovators Pvt Ltd',
                    userType: 'company',
                    summary:
                      'We are a tech company specializing in AI and ML solutions.',
                    location: 'New York, USA',
                    companyLogo: 'https://example.com/uploads/logo.png',
                    phoneNumber: 1234567890,
                    businessType: 'Software Development',
                    industryType: 'Information Technology',
                    timeZonePreferences: 'GMT+5:30',
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Company name is required',
                },
              },
            },
          },
          404: {
            description: 'Not found - User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'User not found',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                },
                example: {
                  error: 'Server error',
                  details: 'An unexpected error occurred',
                },
              },
            },
          },
        },
      },
    },

    // Delete Company Profile
    '/delete-company/{companyId}': {
      post: {
        tags: ['Company Management'],
        summary: 'Delete Company Profile',
        description:
          'Deletes a company profile associated with the given user ID.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description:
              'The ID of the user whose company profile needs to be deleted.',
            schema: {
              type: 'string',
              example: '63f4a2e9c1a4c99dcd098765',
            },
          },
        ],
        responses: {
          200: {
            description: 'Company profile deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Company profile deleted successfully',
                },
              },
            },
          },
          404: {
            description: 'Company profile not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Company profile not found',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                },
                example: {
                  error: 'Server error',
                  details: 'An unexpected error occurred',
                },
              },
            },
          },
        },
      },
    },

    // Get Company Profile by User ID
    '/get-company/{companyId}': {
      get: {
        tags: ['Company Management'],
        summary: 'Get Company Profile by ID',
        description:
          'Retrieve the company profile for the authenticated user by their user ID.',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            description:
              'ID of the user whose company profile is to be fetched',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Company Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    company: { $ref: '#/components/schemas/Company' },
                  },
                },
                example: {
                  message: 'Company Profile retrieved successfully',
                  company: {
                    companyName: 'Tech Innovators Pvt Ltd',
                    userType: 'company',
                    summary:
                      'We are a tech company specializing in AI and ML solutions.',
                    location: 'New York, USA',
                    companyLogo: 'https://example.com/uploads/logo.png',
                    phoneNumber: 1234567890,
                    businessType: 'Software Development',
                    industryType: 'Information Technology',
                    timeZonePreferences: 'GMT+5:30',
                  },
                },
              },
            },
          },
          404: {
            description: 'Company Profile not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Company profile not found',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                },
                example: {
                  error: 'Server error',
                  details: 'An unexpected error occurred',
                },
              },
            },
          },
        },
      },
    },

    // Get All Companies with Pagination
    '/get-all-comapies': {
      get: {
        tags: ['Company Management'],
        summary: 'Get all Companies with Pagination',
        description:
          'Retrieve a paginated list of companies. You can specify the page and limit for the results.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of results per page',
            required: false,
            schema: {
              type: 'integer',
              default: 20,
            },
          },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Companies retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaginationResponse',
                },
                example: {
                  message: 'Companies retrieved successfully',
                  companies: [
                    {
                      companyName: 'Tech Innovators Pvt Ltd',
                      userType: 'company',
                      summary:
                        'We are a tech company specializing in AI and ML solutions.',
                      location: 'New York, USA',
                      companyLogo: 'https://example.com/uploads/logo.png',
                      phoneNumber: 1234567890,
                      businessType: 'Software Development',
                      industryType: 'Information Technology',
                      timeZonePreferences: 'GMT+5:30',
                    },
                    {
                      companyName: 'FutureTech Solutions',
                      userType: 'company',
                      summary: 'Leading provider of cloud-based solutions.',
                      location: 'San Francisco, USA',
                      companyLogo: 'https://example.com/uploads/logo2.png',
                      phoneNumber: 9876543210,
                      businessType: 'Cloud Solutions',
                      industryType: 'Technology',
                      timeZonePreferences: 'GMT-7:00',
                    },
                  ],
                  pagination: {
                    currentPage: 1,
                    totalPages: 5,
                    totalCompanies: 100,
                  },
                },
              },
            },
          },
          404: {
            description: 'No companies found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'No companies found',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                },
                example: {
                  error: 'Server error',
                  details: 'An unexpected error occurred',
                },
              },
            },
          },
        },
      },
    },
    //Update Company
    '/update-company/{companyId}': {
      post: {
        tags: ['Company Management'],
        summary: 'Update Company Profile',
        description:
          'Update the details of an existing company profile for the authenticated user. Only the fields provided in the request body will be updated.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  companyName: { type: 'string', description: 'Company name' },
                  summary: { type: 'string', description: 'Company summary' },
                  location: { type: 'string', description: 'Company location' },
                  companyLogo: {
                    type: 'string',
                    description: 'Company logo URL',
                  },
                  phoneNumber: {
                    type: 'integer',
                    description: 'Company phone number',
                  },
                  businessType: {
                    type: 'string',
                    description: 'Business type',
                  },
                  industryType: {
                    type: 'string',
                    description: 'Industry type',
                  },
                  timeZonePreferences: {
                    type: 'string',
                    description: 'Time zone preference',
                  },
                },
                required: ['companyName'], // Adjust according to required fields
              },
              example: {
                companyName: 'Tech Innovators Pvt Ltd',
                summary:
                  'We are a tech company specializing in AI and ML solutions.',
                location: 'New York, USA',
                companyLogo: 'https://example.com/uploads/logo.png',
                phoneNumber: 1234567890,
                businessType: 'Software Development',
                industryType: 'Information Technology',
                timeZonePreferences: 'GMT+5:30',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Company Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    company: { $ref: '#/components/schemas/Company' },
                  },
                },
                example: {
                  message: 'Company Profile updated successfully',
                  company: {
                    companyName: 'Tech Innovators Pvt Ltd',
                    userType: 'company',
                    summary:
                      'We are a tech company specializing in AI and ML solutions.',
                    location: 'New York, USA',
                    companyLogo: 'https://example.com/uploads/logo.png',
                    phoneNumber: 1234567890,
                    businessType: 'Software Development',
                    industryType: 'Information Technology',
                    timeZonePreferences: 'GMT+5:30',
                  },
                },
              },
            },
          },
          404: {
            description: 'Company Profile not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Company profile not found',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Validation Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Company name is required',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    details: { type: 'string' },
                  },
                },
                example: {
                  error: 'Server error',
                  details: 'An unexpected error occurred',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = companyOptions;
