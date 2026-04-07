const projectSchema = require('../schema/project');

const projectOptions = {
  components: {
    schemas: {
      Project: projectSchema,
    },
  },
  paths: {
    //Add Project
    '/add-project': {
      post: {
        tags: ['Projects Management'],
        summary: 'Add a new project',
        description:
          'This endpoint allows authenticated users to add a new project for their company.',
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
                required: ['project_name'],
                properties: {
                  project_name: {
                    type: 'string',
                    description: 'The name of the project',
                  },
                  scope_description: {
                    type: 'string',
                    description: 'The scope description of the project',
                  },
                  account_manager_name: {
                    type: 'string',
                    description:
                      'Name of the account manager handling the project',
                  },
                  developers: {
                    type: 'array',
                    description: 'List of developers assigned to the project',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the developer',
                        },
                        photo: {
                          type: 'string',
                          description: "URL to the developer's photo",
                        },
                        skills: {
                          type: 'array',
                          description: 'Skills of the developer',
                          items: {
                            type: 'string',
                          },
                        },
                        desc: {
                          type: 'string',
                          description: 'Short description about the developer',
                        },
                        contact_no: {
                          type: 'string',
                          description: "Developer's contact number",
                        },
                        email_id: {
                          type: 'string',
                          description: "Developer's email ID",
                        },
                        hourly_rate: {
                          type: 'number',
                          description: 'Hourly rate of the developer in USD',
                        },
                        joining_date: {
                          type: 'string',
                          format: 'date',
                          description: 'Date the developer joined the project',
                        },
                        availability: {
                          type: 'string',
                          description: 'Availability status of the developer',
                          enum: ['Available', 'Unavailable'],
                        },
                      },
                    },
                  },
                  deadline: {
                    type: 'string',
                    format: 'date',
                    description: 'The project deadline',
                  },
                  working_hours: {
                    type: 'string',
                    description: 'The working hours for the project',
                  },
                  technology: {
                    type: 'array',
                    description: 'Technologies used in the project',
                    items: {
                      type: 'string',
                    },
                  },
                  project_status: {
                    type: 'string',
                    description: 'The current status of the project',
                    enum: ['Pending', 'In Progress', 'Completed', 'On Hold'],
                  },
                  project_start_date: {
                    type: 'string',
                    format: 'date',
                    description: 'The start date of the project',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Project added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    message: {
                      type: 'string',
                    },
                    project: {
                      $ref: '#/components/schemas/Project',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Project with the same name already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Company not found for the user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    message: {
                      type: 'string',
                    },
                    error: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    //get all projects
    '/get-projects': {
      get: {
        tags: ['Projects Management'],
        summary: 'Get all projects with pagination',
        description:
          'This endpoint retrieves a list of projects with pagination support.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: {
              type: 'integer',
              example: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of projects per page',
            required: false,
            schema: {
              type: 'integer',
              example: 20,
            },
          },
        ],
        responses: {
          200: {
            description: 'Projects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Projects retrieved successfully',
                    },
                    projects: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Project',
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        currentPage: {
                          type: 'integer',
                          example: 1,
                        },
                        totalPages: {
                          type: 'integer',
                          example: 5,
                        },
                        totalProjects: {
                          type: 'integer',
                          example: 100,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No projects found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'No Projects found',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Server error',
                    },
                    details: {
                      type: 'string',
                      example: 'Error details here',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    //get project by id
    '/get-project/{projectId}/': {
      get: {
        tags: ['Projects Management'],
        summary: 'Get a project by ID',
        description:
          'This endpoint retrieves a specific project by its unique ID.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            description: 'The unique ID of the project to retrieve',
            schema: {
              type: 'string',
              example: '64fa917c9c7a7c7f4a1b2c34',
            },
          },
        ],
        responses: {
          200: {
            description: 'Project retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Project retrieved successfully',
                    },
                    project: {
                      $ref: '#/components/schemas/Project',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Project ID is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Project ID is required.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Project not found',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Failed to fetch project',
                    },
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Get Projects By Company ID
    '/get-projects-by-company/{companyId}': {
      get: {
        tags: ['Projects Management'],
        summary: 'Get all projects by company ID',
        description:
          'This endpoint retrieves a list of projects for a specific company by its unique ID.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'companyId',
            in: 'path',
            required: true,
            description:
              'The unique ID of the company to retrieve projects for',
            schema: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85', // Example company ID
            },
          },
        ],
        responses: {
          200: {
            description: 'Projects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Projects retrieved successfully',
                    },
                    projects: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Project',
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Valid Company ID is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Valid Company ID is required.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No projects found for this company',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'No projects found for this company.',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Failed to retrieve projects.',
                    },
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Delete Project By ID
    '/delete-project/{projectId}/': {
      post: {
        tags: ['Projects Management'],
        summary: 'Delete a project by ID',
        description:
          'This endpoint allows users to delete a specific project by its unique ID.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            description: 'The unique ID of the project to delete',
            schema: {
              type: 'string',
              example: '64fa917c9c7a7c7f4a1b2c34', // Example project ID
            },
          },
        ],
        responses: {
          200: {
            description: 'Project deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Project deleted successfully',
                    },
                    project: {
                      $ref: '#/components/schemas/Project',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Project ID is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Project ID is required.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Project not found.',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Failed to delete project.',
                    },
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = projectOptions;
