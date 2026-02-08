class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // super() sends the message to the built-in Error class

    this.statusCode = statusCode;
    // Automatically set status to 'fail' for 4xx errors and 'error' for 5xx errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;