import { validateUser, validatePartialUser } from "../schemas/user.js"
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";


export const getUsers = (userModel) => errorWrapper(async (req, res) => {
    const respond = await userModel.find({}, {
        _id: 0
    });
    

    res.json({
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
})

export const deleteUser = (userModel) => errorWrapper(async (req, res) => {
    
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