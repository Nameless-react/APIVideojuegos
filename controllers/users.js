import { validateUser, validatePartialUser } from "../schemas/user.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";



export const getUsers = (userModel) => errorWrapper(async (req, res) => {
    const respond = await userModel.find({}, {
        _id: 0,
        apiKey: 0,
        password: 0
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
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerUser = (userModel) => errorWrapper(async (req, res) => {
    const result = validateUser(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);

    const hashPassword = await bcrypt.hash(result.data.password, 10);
    const apiKey = randomUUID();
    const hashApiKey = await bcrypt.hash(apiKey, 10);

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
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await userModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateUser = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialUser(req.body);
    
    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const userUpdated = await userModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: userUpdated
    })    
})

export const generateApiKey = (userModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    

    const alreadyExist = await userModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    

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