module.exports = {
  type: 'object',
  required: ['project_name', 'companyId', 'companyName'],
  properties: {
    _id: {
      type: 'string',
      description: 'Unique identifier for the project',
      example: '63fa946cf1a3fbd543b3a2e7',
    },
    project_name: {
      type: 'string',
      description: 'Name of the project',
      example: 'AI-Powered Chatbot Development',
    },
    scope_description: {
      type: 'string',
      description: "Description of the project's scope",
      example: 'Develop an AI-powered chatbot for customer service.',
    },
    account_manager_name: {
      type: 'string',
      description: 'Name of the account manager overseeing the project',
      example: 'John Doe',
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
            example: 'Jane Smith',
          },
          photo: {
            type: 'string',
            description: "URL of the developer's photo",
            example: 'https://example.com/uploads/jane_smith.png',
          },
          skills: {
            type: 'array',
            description: 'Skills of the developer',
            items: {
              type: 'string',
            },
            example: ['JavaScript', 'React', 'Node.js'],
          },
          desc: {
            type: 'string',
            description: 'Short description about the developer',
            example: 'Full-stack developer with 5 years of experience.',
          },
          contact_no: {
            type: 'string',
            description: 'Contact number of the developer',
            example: '+1234567890',
          },
          email_id: {
            type: 'string',
            description: 'Email ID of the developer',
            example: 'jane.smith@example.com',
          },
          hourly_rate: {
            type: 'number',
            description: 'Hourly rate of the developer in USD',
            example: 50,
          },
          joining_date: {
            type: 'string',
            format: 'date',
            description: 'Date when the developer joined the project',
            example: '2024-02-01',
          },
          availability: {
            type: 'string',
            description: 'Availability status of the developer',
            enum: ['Available', 'Unavailable'],
            example: 'Available',
          },
        },
      },
    },
    deadline: {
      type: 'string',
      format: 'date',
      description: 'Deadline for the project',
      example: '2025-06-30',
    },
    working_hours: {
      type: 'string',
      description: 'Working hours allocated for the project',
      example: '9:00 AM - 6:00 PM',
      default: 'Not specified',
    },
    technology: {
      type: 'array',
      description: 'Technologies used in the project',
      items: {
        type: 'string',
      },
      example: ['JavaScript', 'Node.js', 'MongoDB'],
    },
    project_status: {
      type: 'string',
      description: 'Current status of the project',
      enum: ['Pending', 'In Progress', 'Completed', 'On Hold'],
      example: 'In Progress',
      default: 'Pending',
    },
    project_start_date: {
      type: 'string',
      format: 'date',
      description: 'Start date of the project',
      example: '2025-01-01',
    },
    companyId: {
      type: 'string',
      description: 'Reference to the company associated with the project',
      example: '63fa946cf1a3fbd543b3a2d1',
    },
    companyName: {
      type: 'string',
      description: 'Name of the company associated with the project',
      example: 'Tech Innovators Pvt Ltd',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp when the project was created',
      example: '2025-01-08T12:34:56.789Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp when the project was last updated',
      example: '2025-01-10T14:45:12.123Z',
    },
  },
};
