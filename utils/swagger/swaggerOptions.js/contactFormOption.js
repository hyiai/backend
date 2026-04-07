const ContactFormSchema = require('../schema/contactForm');
const contactFormOptions = {
  components: {
    schemas: { ContactForm: ContactFormSchema },
  },
  paths: {
    '/contact-form': {
      post: {
        tags: ['Contact Form'],
        summary: 'Submit Contact Form',
        description: 'Allows users to submit a contact form for inquiries.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactForm',
              },
              example: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                phoneNumber: 1234567890,
                message: 'Looking forward to connecting with your team.',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Form submitted successfully',
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

module.exports = contactFormOptions;
