import errorWrapper from "../utils/errorWrapper.js";
import logger from "../utils/logger.js";

export default (userModel) => errorWrapper(async (req, res, next) => {
    
    logger.info(`USER: ${res.locals.user.name}
                \nROLES: ${res.locals.user.roles.join(", ")}
                \nENDPOINT: ${req.originalUrl}
                \nMETHOD: ${req.method}
                \n------------------------------\n`);
    console.log(res.locals.user)
    await userModel.updateUsageCount(res.locals.user._id);
    next();
})