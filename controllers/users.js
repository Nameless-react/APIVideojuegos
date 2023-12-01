import { validateUser, validatePartialUser, validateUserRole } from "../schemas/user.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { filters } from "../utils/filterUser.js"


export const getUsers = (userModel) => errorWrapper(async (req, res) => {
    const { name, email, roles, usage } = req.query;

    const fields = {
        name: parseInt(name) === 1 ? 1 : name,
        email: parseInt(email) === 1 ? 1 : email,
        roles: parseInt(roles) === 1 ? 1 : (roles && roles.split(",")),
        usage: parseInt(usage) === 1 ? 1 : usage,
    }
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));


    const respond = await userModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value), userModel), {
        _id: 0,
        apiKey: 0,
        password: 0,
        ...selectedFields
    });
    

    res.status(200).json({
        status: "success",
        data: respond
    });
})

export const getUser = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let email = id;        
    const respond = id.length < 24 ? await userModel.findOne({email: {$eq: email}}) : await userModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError("The document was not found", 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerUser = (userModel) => errorWrapper(async (req, res) => {
    const result = validateUser(req.body);
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);

    const hashPassword = await bcrypt.hash(result.data.password, 10);
    const apiKey = randomUUID();
    const hashApiKey = await bcrypt.hash(apiKey, 10);

    const alreadyExist = await developerModel.findOne({email: result.data.email});
    if (alreadyExist) throw new CustomError(`Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/users/${alreadyExist._id}`, 409, "redirect");
    
    const {password, ...finalResult} = result.data;

    await userModel.create({
        ...finalResult,
        password: hashPassword,
        apiKey: hashApiKey,
        roles: [
            "User"
        ],
        usage: []
    })
    res.status(201).json({
        status: "success",
        message: `User registration was successful, and an API key has been generated for accessing the endpoints. Please keep this API key safe, as it cannot be recovered if lost. Api Key: ${apiKey}`
    })
    
})

export const deleteUser = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Cannot delete the requested document", 404, "not found");
    
    
    await userModel.deleteOne(alreadyExist._id);
    res.status(200).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateUser = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialUser(req.body);
    
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")
    
    
    const userUpdated = await userModel.findOneAndUpdate({_id: alreadyExist._id}, {...result.data}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: userUpdated
    })    
})

export const generateApiKey = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    

    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")
    

    const newApiKey = randomUUID();
    const hashedNewApiKey = await bcrypt.hash(newApiKey, 10)
    await userModel.updateOne({_id: alreadyExist._id}, {
        apiKey: hashedNewApiKey
    })
    res.status(200).json({
        status: "success",
        data: `API key has been generated for accessing the endpoints. Please keep this API key safe, as it cannot be recovered if lost. Api Key: ${newApiKey}`
    })

})

export const addRole = (userModel, roleModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validateUserRole(req.body);
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);

   const roles = await roleModel.find({});
    if (!roles.map(document => document.name).includes(capitalize(result.data.role))) throw new CustomError("The role does not exists", 404, "not found")

    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")

    if (alreadyExist.roles.includes(capitalize(result.data.role))) throw new CustomError("The role already exists in the user", 409, "Conflict")

    const userUpdated = await userModel.findOneAndUpdate({_id: alreadyExist._id}, {$push: {roles: result.data.role}}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: userUpdated
    }) 
})

export const deleteRole = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validateUserRole(req.body);

    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")


    const userUpdated = await userModel.findOneAndUpdate({_id: alreadyExist._id}, {$pull: {roles: result.data.role}}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: userUpdated
    }) 
})