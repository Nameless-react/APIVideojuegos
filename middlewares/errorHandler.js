import logger from "../utils/logger.js";

export default (error, req, res, next) => {
    const status = error.statusCode ?? 500;
    if (!res.locals.user) res.locals.user = {name: "unknown", roles: []}

    logger.error(`USER: ${res.locals.user.name}
ROLES: ${res.locals.user.roles.join(", ")}
ENDPOINT: ${req.originalUrl}
METHOD: ${req.method}
ERROR: ${error.stack}
----------------------------------`);
    
    if (error.isOperational) { 
        return res.status(status).json({
            status: error.status ?? "failed",
            message: error.isZodError ? JSON.parse(error.message) : error.message,
            data: []
        })
    }

    res.status(500).json({
        status: error.status ?? "failed",
        message: "Something went wrong, try again",
        data: []
    })

}