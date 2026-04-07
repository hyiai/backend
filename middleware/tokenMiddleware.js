const jwt = require('jsonwebtoken');
const redis = require('redis');
const { isTokenBlacklisted } = require('../utils/blacklist');
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token after "Bearer"

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }
  // Check if the token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(401).send({ message: 'Unauthorized: Token invalidated' });
  }

  try {
    // Verify the token using the secret key from the environment
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // Attach the decoded token to the request object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
