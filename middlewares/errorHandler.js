import logger from "../utils/logger.js";

export default (error, req, res, next) => {
    const status = error.statusCode ?? 500;
    logger.error(error.stack);

    
    if (error.isOperational) { 
        return res.status(status).json({
            status: error.status ?? "failed",
            message: JSON.parse(error.message),
            data: []
        })
    }

    res.status(500).json({
        status: error.status ?? "failed",
        message: "Something went wrong, try again",
        data: []
    })

}