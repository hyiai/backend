const {
  signupUser,
  loginUser,
  forgetPassword,
  resetPassword,
  logoutUser,
} = require('../controller/authController');
const { UserBase } = require('../models/authModel');
const {
  sendWelcomeEmail,
  sendResetLinkEmail,
} = require('../utils/EmailSender');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addToBlacklist, blacklist } = require('../utils/blacklist');
// Mock external dependencies
jest.mock('../models/authModel');
jest.mock('../utils/EmailSender');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
// Mock the blacklist methods
jest.mock('../utils/blacklist.js', () => {
  const mockBlacklist = new Set();
  return {
    addToBlacklist: jest.fn((token) => mockBlacklist.add(token)),
    isTokenBlacklisted: jest.fn((token) => mockBlacklist.has(token)),
    blacklist: mockBlacklist, // Return the mock blacklist for testing
  };
});

// Tests for signupUser
describe('Auth Controller - Signup User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if passwords do not match', async () => {
    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password124', // Different password
        userType: 'user',
      },
    });
    const res = httpMocks.createResponse();

    await signupUser(req, res);

    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ error: 'Passwords do not match' });
  });

  it('should return 400 if confirmPassword is not provided', async () => {
    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
        userType: 'user',
      },
    });
    const res = httpMocks.createResponse();

    await signupUser(req, res);

    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ error: 'Please confirm the password!' });
  });

  it('should successfully sign up a user and return a token', async () => {
    // Mock UserBase.signup
    const mockUser = {
      _id: '12345',
      email: 'test@example.com',
      userType: 'user',
      save: jest.fn(), // Mock the save method
    };
    UserBase.signup.mockResolvedValue(mockUser);

    // Mock sendWelcomeEmail
    sendWelcomeEmail.mockResolvedValue();

    // Mock createToken
    const mockToken = 'mocked-jwt-token';
    jwt.sign.mockReturnValue(mockToken);

    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        userType: 'user',
      },
    });
    const res = httpMocks.createResponse();

    await signupUser(req, res);

    expect(UserBase.signup).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'user',
    );
    expect(sendWelcomeEmail).toHaveBeenCalledWith('test@example.com');
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: '12345', email: 'test@example.com' },
      process.env.SECRET,
      { expiresIn: '1d' },
    );

    // Ensure the token is set and save is called
    expect(mockUser.jwtToken).toBe(mockToken);
    expect(mockUser.save).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({
      token: mockToken,
      message: 'Successfully signed up',
    });
  });

  it('should return 400 if signup throws an error', async () => {
    const mockError = new Error('Email already exists');
    UserBase.signup.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        userType: 'user',
      },
    });
    const res = httpMocks.createResponse();

    await signupUser(req, res);

    expect(UserBase.signup).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ error: 'Email already exists' });
  });
});

// Tests for singinuser
describe('Auth Controller - Login User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is incorrect', async () => {
    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const res = httpMocks.createResponse();

    // Mock UserBase.login to simulate a failed login
    UserBase.login.mockRejectedValue(new Error('Invalid email or password'));

    await loginUser(req, res);

    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ error: 'Invalid email or password' });
  });

  it('should successfully log in a user and return a token', async () => {
    // Mock the logged-in user
    const mockUser = {
      _id: '12345',
      email: 'test@example.com',
      userType: 'user',
      save: jest.fn(), // Mock the save method
    };
    UserBase.login.mockResolvedValue(mockUser);

    // Mock createToken
    const mockToken = 'mocked-jwt-token';
    jwt.sign.mockReturnValue(mockToken);

    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const res = httpMocks.createResponse();

    await loginUser(req, res);

    // Check that the login method was called with the correct arguments
    expect(UserBase.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    );

    // Check that the token was created correctly
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: '12345', email: 'test@example.com' },
      process.env.SECRET,
      { expiresIn: '1d' },
    );

    // Ensure the token is set and save is called (if used in the controller)
    expect(mockUser.jwtToken).toBe(mockToken);
    expect(mockUser.save).toHaveBeenCalled();

    // Check the response
    expect(res.statusCode).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({
      token: mockToken,
      message: 'Successfully logged in',
    });
  });

  it('should return 400 if login throws an error', async () => {
    const mockError = new Error('Invalid email or password');
    UserBase.login.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const res = httpMocks.createResponse();

    await loginUser(req, res);

    expect(UserBase.login).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ error: 'Invalid email or password' });
  });
});

//Test for forgot password
describe('Auth Controller - Forgot Password', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email is not provided', async () => {
    const req = httpMocks.createRequest({ body: {} });
    const res = httpMocks.createResponse();

    await forgetPassword(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(
      JSON.stringify({ message: 'Please provide email' }),
    );
  });

  it('should return 404 if user does not exist', async () => {
    UserBase.findOne.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      body: { email: 'test@example.com' },
    });
    const res = httpMocks.createResponse();

    await forgetPassword(req, res);

    expect(UserBase.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(res.statusCode).toBe(404);
    expect(res._getData()).toEqual(
      JSON.stringify({ message: 'User not found' }),
    );
  });

  it('should send reset link if user exists', async () => {
    UserBase.findOne.mockResolvedValue({
      _id: '123',
      email: 'test@example.com',
    });
    jwt.sign.mockReturnValue('mocked-reset-token');
    sendResetLinkEmail.mockResolvedValue();

    const req = httpMocks.createRequest({
      body: { email: 'test@example.com' },
    });
    const res = httpMocks.createResponse();

    await forgetPassword(req, res);

    expect(UserBase.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: '123', email: 'test@example.com' },
      process.env.SECRET,
      { expiresIn: '1d' },
    );
    expect(sendResetLinkEmail).toHaveBeenCalledWith(
      'test@example.com',
      `${process.env.CLIENT_URL}/reset-password?token=mocked-reset-token`,
    );
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toEqual(
      JSON.stringify({
        message: 'Password reset link has been sent to your email',
      }),
    );
  });
});

//Test for reset password
describe('Auth Controller - Reset Password', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if password or confirmPassword is not provided', async () => {
    const req = httpMocks.createRequest({
      body: { token: 'mocked-token' },
    });
    const res = httpMocks.createResponse();

    await resetPassword(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Please provide new password and confirm password',
    });
  });

  it('should return 400 if passwords do not match', async () => {
    const req = httpMocks.createRequest({
      body: {
        token: 'mocked-token',
        password: 'password123',
        confirmPassword: 'password124',
      },
    });
    const res = httpMocks.createResponse();

    await resetPassword(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Passwords do not match' });
  });

  it('should return 404 if user is not found', async () => {
    jwt.verify.mockReturnValue({ _id: '123' });
    UserBase.findById.mockResolvedValue(null); // Mock user not found

    const req = httpMocks.createRequest({
      body: {
        token: 'mocked-token',
        password: 'password123',
        confirmPassword: 'password123',
      },
    });
    const res = httpMocks.createResponse();

    await resetPassword(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mocked-token', process.env.SECRET);
    expect(UserBase.findById).toHaveBeenCalledWith('123');
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'User not found' });
  });

  it('should successfully reset password', async () => {
    jwt.verify.mockReturnValue({ _id: '123' });
    UserBase.findById.mockResolvedValue({ _id: '123', save: jest.fn() });
    bcrypt.hash.mockResolvedValue('hashed-password');

    const req = httpMocks.createRequest({
      body: {
        token: 'mocked-token',
        password: 'password123',
        confirmPassword: 'password123',
      },
    });
    const res = httpMocks.createResponse();

    await resetPassword(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mocked-token', process.env.SECRET);
    expect(UserBase.findById).toHaveBeenCalledWith('123');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Password reset successfully',
    });
  });
});

//Test for logout
// Tests for logoutUser
describe('Auth Controller - Logout User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if token is not provided', async () => {
    const req = httpMocks.createRequest({
      headers: {},
    });
    const res = httpMocks.createResponse();

    await logoutUser(req, res);

    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ message: 'Token not provided' });
  });

  it('should return 404 if user is not found', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = httpMocks.createResponse();

    // Mock JWT verification to return a valid user ID
    jwt.verify.mockReturnValue({ _id: '123' });

    // Mock the user not being found in the database
    UserBase.findById.mockResolvedValue(null);

    await logoutUser(req, res);

    expect(UserBase.findById).toHaveBeenCalledWith('123');
    expect(res.statusCode).toBe(404);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ message: 'User not found' });
  });

  it('should successfully log out a user', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = httpMocks.createResponse();

    const mockUser = {
      _id: '123',
      jwtToken: 'mocked-jwt-token',
      save: jest.fn(),
    };

    // Mock JWT verification to return a valid user ID
    jwt.verify.mockReturnValue({ _id: '123' });

    // Mock the user being found and updating the jwtToken to null
    UserBase.findById.mockResolvedValue(mockUser);

    await logoutUser(req, res);

    expect(UserBase.findById).toHaveBeenCalledWith('123');
    expect(mockUser.jwtToken).toBeNull();
    expect(mockUser.save).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ message: 'Successfully logged out' });
  });
});
