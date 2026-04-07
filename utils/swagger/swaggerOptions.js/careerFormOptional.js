const CareerFormSchema = require('../schema/careerForm');
const careerFormOptions = {
  components: {
    schemas: {
      Career: CareerFormSchema,
    },
  },
  paths: {
    '/career-form': {
      post: {
        tags: ['Career Form'],
        summary: 'Submit Career Form',
        description:
          'Allows applicants to submit their career details and resume for job opportunities.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Career',
              },
              example: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                phoneNumber: 1234567890,
                message: 'I am excited about this opportunity.',
                resume: 'https://example.com/uploads/resume.pdf',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Career form submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message:
                    "Thank you for contacting us! We'll get back to you soon.",
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
                  error: 'All fields are required except message.',
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
                  },
                },
                example: {
                  error: 'Something went wrong. Please try again later.',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = careerFormOptions;
