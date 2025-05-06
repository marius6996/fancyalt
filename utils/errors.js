//utils/errors.js

//base custom error class that extends the built-in Error object
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

//400 Bad Request error
class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

//401 Unauthorized error
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

//403 Forbidden error class
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

//404 Not Found error
class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

//415 Unsupported media type
class UnsupportedMediaTypeError extends AppError {
    constructor(message = 'Unsupported Media Type') {
        super(message, 415);
    }
}

//422 Unprocessable Entity
class UnprocessableEntityError extends AppError {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422);
    }
}

//exporting all error classes for use in other parts of the app
module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    UnsupportedMediaTypeError,
    UnprocessableEntityError,
};

