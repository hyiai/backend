// swagger/schemas/userBaseSchema.js
module.exports = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'example@domain.com',
      description: "User's unique email address",
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'P@ssw0rd!',
      description: "User's password (hashed in the backend)",
    },
    otp: {
      type: 'string',
      example: '123456',
      description: 'One-Time Password for authentication (if applicable)',
    },
    otpExpiration: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-01T12:00:00Z',
      description: 'Expiration date and time for the OTP',
    },
    isOtpVerified: {
      type: 'boolean',
      example: false,
      description: "Indicates if the user's OTP is verified",
    },
    status: {
      type: 'integer',
      enum: [0, 1, 2],
      example: 1,
      description: 'User status: 0 = Inactive, 1 = Active, 2 = Suspended',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-01T12:00:00Z',
      description: 'Timestamp when the user was created',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-02T12:00:00Z',
      description: 'Timestamp when the user was last updated',
    },
  },
  required: ['email', 'password'],
};
