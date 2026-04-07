// components.schemas.Contact
module.exports = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: 'First name of the contact person',
      example: 'John',
    },
    lastName: {
      type: 'string',
      description: 'Last name of the contact person',
      example: 'Doe',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email address of the contact person',
      example: 'johndoe@example.com',
    },
    phoneNumber: {
      type: 'number',
      description: 'Contact phone number',
      example: 1234567890,
    },
    message: {
      type: 'string',
      description: 'Optional message from the contact person',
      example: 'Looking forward to connecting with your team.',
    },
    resume: {
      type: 'string',
      description: 'Upload Your Resume',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp when the contact entry was created',
      example: '2025-01-22T10:00:00Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp when the contact entry was last updated',
      example: '2025-01-23T10:00:00Z',
    },
  },
  required: ['firstName', 'lastName', 'email', 'phoneNumber', 'resume'],
};
