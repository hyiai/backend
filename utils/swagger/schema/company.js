// components.schemas.Company
module.exports = {
  type: 'object',
  properties: {
    companyName: {
      type: 'string',
      description: 'Name of the company',
      example: 'Tech Innovators Pvt Ltd',
    },
    userType: {
      type: 'string',
      enum: ['jobseeker', 'company', 'accountManager', 'admin'],
      description: 'Type of user associated with the company',
      example: 'company',
    },
    user: {
      type: 'string',
      description: 'Reference to the UserBase schema (user ID)',
      example: '63d9c8e8b4461c3e5b273f3b',
    },
    companyLogo: {
      type: 'string',
      description: 'URL of the company logo',
      example: 'https://example.com/uploads/logo.png',
    },
    location: {
      type: 'string',
      description: "Company's location",
      example: 'New York, USA',
    },
    summary: {
      type: 'string',
      description: 'Short summary about the company',
      example: 'We are a tech company specializing in AI and ML solutions.',
    },
    phoneNumber: {
      type: 'number',
      description: "Company's contact number",
      example: 1234567890,
    },
    businessType: {
      type: 'string',
      description: 'Type of business the company is involved in',
      example: 'Software Development',
    },
    industryType: {
      type: 'string',
      description: 'Industry type the company belongs to',
      example: 'Information Technology',
    },
    taxNumber: {
      type: 'number',
      description: "Company's tax identification number",
      example: 987654321,
    },
    timeZonePreferences: {
      type: 'string',
      description: 'Time zone preferences for the company',
      example: 'GMT+5:30',
    },
  },
  required: ['companyName', 'user', 'userType'],
};
