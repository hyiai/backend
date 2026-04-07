const jobseekerSchema = require('../schema/jobseeker');

const jobseekerOptions = {
  components: {
    schemas: {
      Jobseeker: jobseekerSchema,
    },
  },
  paths: {
    //Get All Users
    '/get-users': {
      get: {
        tags: ['Talent Management'],
        summary: 'Get all users with pagination',
        description:
          'Returns a paginated list of users. Requires Bearer Token authentication.',
        operationId: 'getAllUsers',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number (optional)',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of users per page (optional)',
            required: false,
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginationResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized - Bearer token missing or invalid',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Unauthorized',
                  message: 'Bearer token missing or invalid',
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
                  details: 'An unexpected error occurred.',
                },
              },
            },
          },
        },
      },
    },

    // Get User By ID
    '/get-user/{id}': {
      get: {
        tags: ['Talent Management'],
        summary: 'Get user by ID',
        description: 'Fetch a user by their unique ID.',
        operationId: 'getUserById',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "User's unique identifier",
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Jobseeker' },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Not Found',
                  message: 'User with the specified ID does not exist.',
                },
              },
            },
          },
        },
      },
    },
    // Add User
    '/add-user': {
      post: {
        tags: ['Talent Management'],
        summary: 'Add or update user profile',
        description: 'Create or update the jobseeker profile.',
        operationId: 'addOrUpdateUserProfile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Jobseeker', // Reference the Jobseeker schema for the request body
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile created or updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    jobseeker: { $ref: '#/components/schemas/Jobseeker' },
                  },
                },
                example: {
                  message: 'Profile created successfully',
                  jobseeker: {
                    userName: 'John Doe',
                    userType: 'jobseeker',
                    profilePicture: null,
                    phoneNumber: '1234567890',
                    location: 'New York',
                    summary: 'Software Developer',
                    resume: null,
                    technicalSkills: [{ skill: 'JavaScript', exp: 5 }],
                    otherSkills: ['Problem Solving'],
                    experience: [
                      {
                        companyName: 'Company A',
                        duration: '2 years',
                        designation: 'Developer',
                        tags: ['JavaScript', 'React'],
                      },
                    ],
                    projects: [
                      {
                        name: 'Project X',
                        duration: '6 months',
                        description: 'Web application',
                      },
                    ],
                    education: [
                      {
                        institution: 'University A',
                        duration: '4 years',
                        subject: 'Computer Science',
                      },
                    ],
                    typeOfJob: 'full-time',
                    github: 'https://github.com/johndoe',
                    linkedin: 'https://linkedin.com/in/johndoe',
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Bad Request',
                  message: 'Invalid user data provided',
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
                  details: 'An unexpected error occurred.',
                },
              },
            },
          },
        },
      },
    },

    // Delete User
    '/delete-user/{id}': {
      post: {
        tags: ['Talent Management'],
        summary: 'Delete user by ID',
        description: 'Deletes a user based on their unique ID.',
        operationId: 'deleteUserById',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "User's unique identifier",
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'User deleted successfully',
                },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Not Found',
                  message: 'User with the specified ID does not exist.',
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
                  details: 'An unexpected error occurred.',
                },
              },
            },
          },
        },
      },
    },

    // Update User By ID
    '/update-user/{id}': {
      post: {
        tags: ['Talent Management'],
        summary: 'Update user by ID',
        description:
          "Update the user's profile by their unique ID. Fields can be partially updated.",
        operationId: 'updateUserById',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "User's unique identifier",
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userName: { type: 'string' },
                  summary: { type: 'string' },
                  location: { type: 'string' },
                  profilePicture: { type: 'string' },
                  resume: { type: 'string' },
                  technicalSkills: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        skill: { type: 'string' },
                        exp: { type: 'integer' },
                      },
                    },
                  },
                  otherSkills: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  experience: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        companyName: { type: 'string' },
                        duration: { type: 'string' },
                        designation: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                      },
                    },
                  },
                  projects: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        duration: { type: 'string' },
                        description: { type: 'string' },
                      },
                    },
                  },
                  education: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        institution: { type: 'string' },
                        duration: { type: 'string' },
                        subject: { type: 'string' },
                      },
                    },
                  },
                  typeOfJob: { type: 'string' },
                  github: { type: 'string' },
                  linkedin: { type: 'string' },
                  userType: { type: 'string' },
                  phoneNumber: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        email: { type: 'string' },
                        userName: { type: 'string' },
                        summary: { type: 'string' },
                        location: { type: 'string' },
                        resume: { type: 'string' },
                        technicalSkills: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              skill: { type: 'string' },
                              exp: { type: 'integer' },
                            },
                          },
                        },
                        otherSkills: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        experience: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              companyName: { type: 'string' },
                              duration: { type: 'string' },
                              designation: { type: 'string' },
                              tags: {
                                type: 'array',
                                items: { type: 'string' },
                              },
                            },
                          },
                        },
                        projects: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              duration: { type: 'string' },
                              description: { type: 'string' },
                            },
                          },
                        },
                        education: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              institution: { type: 'string' },
                              duration: { type: 'string' },
                              subject: { type: 'string' },
                            },
                          },
                        },
                        typeOfJob: { type: 'string' },
                        github: { type: 'string' },
                        linkedin: { type: 'string' },
                        profilePicture: { type: 'string' },
                        userType: { type: 'string' },
                        phoneNumber: { type: 'string' },
                      },
                    },
                  },
                },
                example: {
                  message: 'User updated successfully',
                  user: {
                    _id: '12345',
                    email: 'example@email.com',
                    userName: 'John Doe',
                    summary: 'Software Developer',
                    location: 'New York',
                    resume: 'link_to_resume',
                    technicalSkills: [{ skill: 'JavaScript', exp: 5 }],
                    otherSkills: ['Problem Solving'],
                    experience: [
                      {
                        companyName: 'Company A',
                        duration: '2 years',
                        designation: 'Developer',
                        tags: ['JavaScript'],
                      },
                    ],
                    projects: [
                      {
                        name: 'Project X',
                        duration: '6 months',
                        description: 'Web application',
                      },
                    ],
                    education: [
                      {
                        institution: 'University A',
                        duration: '4 years',
                        subject: 'Computer Science',
                      },
                    ],
                    typeOfJob: 'full-time',
                    github: 'https://github.com/johndoe',
                    linkedin: 'https://linkedin.com/in/johndoe',
                    profilePicture: 'link_to_picture',
                    userType: 'jobseeker',
                    phoneNumber: '1234567890',
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Not Found',
                  message: 'User with the specified ID does not exist.',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  error: 'Bad Request',
                  message: 'Invalid user data provided',
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
                  details: 'An unexpected error occurred.',
                },
              },
            },
          },
        },
      },
    },

    // Filter Users by Skills, Type of Job, and Date Range
    '/filter-user': {
      post: {
        tags: ['Talent Management'],
        summary: 'Filter users based on skills, job type, and date range',
        description:
          'Filters users based on specified criteria such as skills, job type, location, and account creation date range.',
        operationId: 'filterUsers',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  skills: {
                    type: 'string',
                    description:
                      "Comma-separated list of skills with experience (e.g., 'JavaScript:3,Node:2')",
                  },
                  typeOfJob: {
                    type: 'string',
                    description: 'The type of job (e.g., full-time, part-time)',
                  },
                  location: {
                    type: 'string',
                    description: 'The location of the jobseeker',
                  },
                  createdAtFrom: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start date for account creation',
                  },
                  createdAtTo: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End date for account creation',
                  },
                  page: {
                    type: 'integer',
                    description: 'Page number for pagination (defaults to 1)',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Filtered users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    users: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          email: { type: 'string' },
                          userName: { type: 'string' },
                          summary: { type: 'string' },
                          location: { type: 'string' },
                          technicalSkills: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                skill: { type: 'string' },
                                exp: { type: 'integer' },
                              },
                            },
                          },
                          experience: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                companyName: { type: 'string' },
                                duration: { type: 'string' },
                                designation: { type: 'string' },
                                tags: {
                                  type: 'array',
                                  items: { type: 'string' },
                                },
                              },
                            },
                          },
                          projects: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                name: { type: 'string' },
                                duration: { type: 'string' },
                                description: { type: 'string' },
                              },
                            },
                          },
                          education: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                institution: { type: 'string' },
                                duration: { type: 'string' },
                                subject: { type: 'string' },
                              },
                            },
                          },
                          typeOfJob: { type: 'string' },
                          github: { type: 'string' },
                          linkedin: { type: 'string' },
                          profilePicture: { type: 'string' },
                          userType: { type: 'string' },
                          phoneNumber: { type: 'string' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        currentPage: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        totalUsers: { type: 'integer' },
                      },
                    },
                  },
                },
                example: {
                  message: 'Filtered users retrieved successfully',
                  users: [
                    {
                      _id: '12345',
                      email: 'example@email.com',
                      userName: 'John Doe',
                      summary: 'Software Developer',
                      location: 'New York',
                      technicalSkills: [{ skill: 'JavaScript', exp: 5 }],
                      experience: [
                        {
                          companyName: 'Company A',
                          duration: '2 years',
                          designation: 'Developer',
                          tags: ['JavaScript'],
                        },
                      ],
                      projects: [
                        {
                          name: 'Project X',
                          duration: '6 months',
                          description: 'Web application',
                        },
                      ],
                      education: [
                        {
                          institution: 'University A',
                          duration: '4 years',
                          subject: 'Computer Science',
                        },
                      ],
                      typeOfJob: 'full-time',
                      github: 'https://github.com/johndoe',
                      linkedin: 'https://linkedin.com/in/johndoe',
                      profilePicture: 'link_to_picture',
                      userType: 'jobseeker',
                      phoneNumber: '1234567890',
                    },
                  ],
                  pagination: {
                    currentPage: 1,
                    totalPages: 5,
                    totalUsers: 100,
                  },
                },
              },
            },
          },
          404: {
            description: 'No users found matching criteria',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'No users found matching criteria',
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
                  details: 'An unexpected error occurred.',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = jobseekerOptions;
