const userBaseSchema = require('../schema/user');

const userBaseOptions = {
  components: {
    schemas: {
      UserBase: userBaseSchema,
    },
  },
  paths: {
    // User Authentication - Signup
    '/sign-up': {
      post: {
        tags: ['Users'],
        summary: 'Signup user with OTP generation',
        description:
          'Creates a new user account and generates an OTP for email verification.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'kowshikmahadev007007@gmail.com',
                    description: "User's email address.",
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'jhefadfk7455A66#',
                    description: "User's password.",
                  },
                  confirmPassword: {
                    type: 'string',
                    format: 'password',
                    example: 'jhefadfk7455A66#',
                    description: "Confirmation of the user's password.",
                  },
                },
                required: ['email', 'password', 'confirmPassword'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'OTP sent successfully. Please verify to continue.',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Validation Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                examples: {
                  missingConfirmPassword: {
                    summary: 'Missing confirmPassword',
                    value: {
                      error: 'Please confirm the password!',
                    },
                  },
                  passwordsMismatch: {
                    summary: 'Passwords do not match',
                    value: {
                      error: 'Passwords do not match',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    //Verify Otp for signUp
    '/verify-otp': {
      post: {
        tags: ['Users'],
        summary: 'Verify OTP',
        description:
          "Verifies the OTP sent to the user's email and completes the signup process.",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'kowshikmahadev007007@gmail.com',
                    description: "User's email address.",
                  },
                  otp: {
                    type: 'string',
                    example: '1234',
                    description: "OTP sent to the user's email.",
                  },
                },
                required: ['email', 'otp'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  message: 'OTP verified successfully. Signup completed.',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid or expired OTP',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                examples: {
                  invalidOtp: {
                    summary: 'Invalid OTP',
                    value: {
                      error: 'Invalid OTP!',
                    },
                  },
                  expiredOtp: {
                    summary: 'Expired OTP',
                    value: {
                      error: 'OTP expired!',
                    },
                  },
                  alreadyVerified: {
                    summary: 'OTP already verified',
                    value: {
                      error: 'OTP already verified!',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    error: { type: 'string' },
                  },
                },
                example: {
                  message: 'Something went wrong',
                  error: 'Database connection failed',
                },
              },
            },
          },
        },
      },
    },

    // User Authentication - Login
    '/sign-in': {
      post: {
        tags: ['Users'],
        summary: 'Login user',
        description:
          'Allows users to log in by providing their email and password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'kowshikmahadev007007@gmail.com',
                    description: "User's email address.",
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'jhefadfk7455A65#',
                    description: "User's password.",
                  },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully logged in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: {
                      type: 'string',
                      description: "User's unique ID.",
                    },
                    token: { type: 'string', description: 'JWT token.' },
                    message: {
                      type: 'string',
                      example: 'Successfully logged in',
                    },
                  },
                },
                example: {
                  userId: '63fd4c8b12345abc678d1234',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  message: 'Successfully logged in',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
                example: {
                  error: 'Invalid email or password',
                },
              },
            },
          },
        },
      },
    },
    // User Authentication - Forgot Password
    '/forgot-password': {
      post: {
        tags: ['Users'],
        summary: 'Forgot Password - OTP Generation',
        description:
          "This endpoint allows users to request a password reset. An OTP is sent to the user's email for verification.",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'kowshikmahadev007007@gmail.com',
                    description: "User's registered email address.",
                  },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'OTP sent to your email for password reset',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Email not provided or user not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'User not found. Please register',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    error: { type: 'string' },
                  },
                },
                example: {
                  message: 'Something went wrong',
                  error: 'Database connection failed',
                },
              },
            },
          },
        },
      },
    },

    // User Authentication - Reset Password
    '/reset-password': {
      post: {
        tags: ['Users'],
        summary: 'Reset Password',
        description:
          'This endpoint allows users to reset their password using their email and a valid OTP.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'kowshikmahadev007007@gmail.com',
                    description: "User's registered email address.",
                  },
                  otp: {
                    type: 'string',
                    example: '123456',
                    description:
                      "OTP sent to the user's email for verification.",
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'NewPassword@123',
                    description:
                      'The new password to set for the user account.',
                  },
                  confirmPassword: {
                    type: 'string',
                    format: 'password',
                    example: 'NewPassword@123',
                    description: 'Confirmation of the new password.',
                  },
                },
                required: ['email', 'otp', 'password', 'confirmPassword'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Password reset successfully',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Validation Error or Incorrect OTP',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
                examples: {
                  missingField: {
                    value: {
                      error: 'Bad Request',
                      message: 'Email, OTP, and new password are required',
                    },
                  },
                  passwordMismatch: {
                    value: {
                      error: 'Passwords do not match',
                      message: 'Please ensure both password fields match',
                    },
                  },
                  invalidOtp: {
                    value: {
                      error: 'Invalid OTP',
                      message: 'The OTP provided is incorrect',
                    },
                  },
                  otpExpired: {
                    value: {
                      error: 'OTP Expired',
                      message: 'OTP has expired',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    error: { type: 'string' },
                  },
                },
                example: {
                  message: 'Something went wrong',
                  error: 'Database connection failed',
                },
              },
            },
          },
        },
      },
    },
    // User Authentication - logout
    '/log-out': {
      post: {
        tags: ['Users'],
        summary: 'Logout user',
        description:
          'Logs out the user by invalidating their JWT token. The token will be added to the blacklist to prevent reuse.',
        security: [
          {
            BearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: 'Successfully logged out',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Successfully logged out',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Token not provided',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = userBaseOptions;
