import errorWrapper from "../utils/errorWrapper.js";
import logger from "../utils/logger.js";

export default (userModel) => errorWrapper(async (req, res, next) => {
    if (!res.locals.user) res.locals.user = {name: "unknown", roles: []}

    logger.info(`USER: ${res.locals.user.name}
ROLES: ${res.locals.user.roles.join(", ")}
ENDPOINT: ${req.originalUrl}
METHOD: ${req.method}
------------------------------`);
    await userModel.updateUsageCount(res.locals.user._id);
    next();
})