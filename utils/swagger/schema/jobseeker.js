// schemas/jobseekerSchema.js
module.exports = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    userType: {
      type: 'string',
      enum: ['jobseeker', 'company', 'accountManager', 'admin'],
    },
    profilePicture: { type: 'string', default: null },
    phoneNumber: { type: 'integer' },
    location: { type: 'string', default: null },
    summary: { type: 'string', default: null },
    resume: { type: 'string', default: null },
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
    otherSkills: { type: 'array', items: { type: 'string' } },
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
    typeOfJob: {
      type: 'string',
      enum: ['full-time', 'part-time', 'both'],
    },
    github: {
      type: 'string',
      pattern:
        '^https?:\\/\\/github\\.com\\/([A-Za-z0-9-_]+\\/)?([A-Za-z0-9-_]+)$',
    },
    linkedin: {
      type: 'string',
      pattern:
        '^https?:\\/\\/linkedin\\.com\\/in\\/([A-Za-z0-9-_]+\\/)?([A-Za-z0-9-_]+)$',
    },
  },
};
