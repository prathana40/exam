// middleware/notFound.js
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
      details: []
    }
  });
};

module.exports = notFound;
