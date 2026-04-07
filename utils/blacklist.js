const blacklist = new Set(); // Replace with Redis or a database in production

// Add token to blacklist
const addToBlacklist = (token) => {
  blacklist.add(token);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};

module.exports = {
  addToBlacklist,
  isTokenBlacklisted,
  blacklist,
};
