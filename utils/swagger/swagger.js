const jobseekerOptions = require('./swaggerOptions.js/jobseekerOptions');
const userBaseOptions = require('./swaggerOptions.js/userBaseOptions');
const companyOptions = require('./swaggerOptions.js/companyOption');
const projectOptions = require('./swaggerOptions.js/projectOption');
const contactFormOption = require('./swaggerOptions.js/contactFormOption');
const careerFormOption = require('./swaggerOptions.js/careerFormOptional');
const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: "HYI API's for Virtual Assistance  &#128526; ",
    description: 'API documentation for the User Management system',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local server',
    },
    {
      url: 'https://staging.hireyoo.com/api',
      description: 'Staging server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      PaginationResponse: {
        type: 'object',
        properties: {
          currentPage: { type: 'integer' },
          totalPages: { type: 'integer' },
          totalUsers: { type: 'integer' },
          users: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserBase' },
          },
        },
      },
      ...jobseekerOptions.components.schemas,
      ...userBaseOptions.components.schemas,
      ...companyOptions.components.schemas,
      ...projectOptions.components.schemas,
      ...contactFormOption.components.schemas,
      ...careerFormOption.components.schemas,
    },
  },
  paths: {
    ...userBaseOptions.paths,
    ...jobseekerOptions.paths,
    ...companyOptions.paths,
    ...projectOptions.paths,
    ...contactFormOption.paths,
    ...careerFormOption.paths,
  },
};

module.exports = swaggerOptions;
