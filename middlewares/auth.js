import errorWrapper from "../utils/errorWrapper.js";
import bcrypt from "bcrypt";
import { CustomError } from "../utils/customError.js";

export default (userModel) => errorWrapper(async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError(JSON.stringify({message: `Not authorize to access the endpoint "${req.originalUrl}"`}), 403, "Forbbiden")

    
    const apiKey = req.get("Authorization");
    const users = await userModel.find();
    
    for (const user of users) {
        const isAuth = await bcrypt.compare(apiKey, user.apiKey);
        if (isAuth) {
            if (/\/users\/[a-zA-Z0-9]*/.test(req.originalUrl) && !user.roles.some(role => "Admin" === role)) throw new CustomError(JSON.stringify({message: `Don't have the right permissions to access the endpoint "${req.originalUrl}"`}), 403, "Forbbiden")
            
            if ((req.method === "PATCH" || req.method === "POST") && !user.roles.some(role => ["Admin", "Moderator"].includes(role))) throw new CustomError(JSON.stringify({message: `Don't have the right permissions to access the endpoint ${req.originalUrl}`}), 403, "Forbbiden")
            
            if (req.method === "DELETE" && !user.roles.some(role => "Admin" === role)) throw new CustomError(JSON.stringify({message: `Don't have the right permissions to access the endpoint "${req.originalUrl}"`}), 403, "Forbbiden")

            res.locals.user = user;
            return next();
        }
    }

    res.status(403).json({
        status: "Forbbiden",
        message: "Not authorize to access the endpoint, your credencials are not valid"
    })
    
})