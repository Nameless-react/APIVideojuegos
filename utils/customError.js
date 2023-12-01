export class CustomError extends Error {
    constructor(message, statusCode, status, isZodError) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.isOperational = true;
        this.isZodError = isZodError ?? false;
    }
}