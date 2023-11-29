import { validateComment, validatePartialComment } from "../schemas/comment.js"
// import { filters } from "../utils/filterComment.js"
import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";



export const getComments = (commentModel) => errorWrapper(async (req, res) => {
    // const fields = {
    //     name: parseInt(name) === 1,
    //     number_employees: employeesNumber,
    //     foundation,
    //     web
    // }
    // const finalFields = Object.fromEntries(Object.entries(fields).filter(field => field[1]).map(field => [field[0], parseInt(field[1])]));


    const respond = await commentModel.find({}, {
        _id: 0,
    });
    

    res.json({
        status: "success",
        data: respond
    });
})

export const getComment = (commentModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await commentModel.findOne({name: {$regex: regexName}}) : await commentModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerComment = (commentModel) => errorWrapper(async (req, res) => {
    const result = validateDeveloper(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await commentModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/comments/${alreadyExist._id}`}), 409, "redirect");
      

    const newDocument = await commentModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteComment = (commentModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await commentModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await commentModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateComment = (commentModel) => errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialComment(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await commentModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const commentUpdated = await commentModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: commentUpdated
    })    
})