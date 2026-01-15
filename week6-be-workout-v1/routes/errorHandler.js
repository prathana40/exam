// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // optional: log the error for debugging

  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = [];

  // Handle Mongoose invalid ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map(e => e.message);
  }

  // Custom error with statusCode and message
  else if (err.statusCode && err.message) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.details) details = err.details;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details
    }
  });
};

module.exports = errorHandler;
