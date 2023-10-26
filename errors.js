class HttpError extends Error {
    constructor({ message, status }) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
    }
}

class NotFoundError extends HttpError {
    constructor(message) {
        super({ message, status: 404 });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

class BadRequestError extends HttpError {
    constructor(message) {
        super({ message, status: 400 });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

class UnauthorizedError extends HttpError {
    constructor(message) {
        super({ message, status: 401 });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

class ForbiddenError extends HttpError {
    constructor(message) {
        super({ message, status: 403 });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

class InternalServerError extends HttpError {
    constructor(message) {
        super({ message, status: 500 });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};


module.exports = {
    HttpError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
};
