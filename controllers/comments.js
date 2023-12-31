import { validateComment, validatePartialComment } from "../schemas/comment.js"
import { filters } from "../utils/filterComment.js"
import { capitalize, isValidNumber } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";



export const getComments = (commentModel) => errorWrapper(async (req, res) => {
    const { author, videogame, minPuntuation, maxPuntuation, minYear, maxYear, content } = req.query;
    let minPuntuationNumber = parseInt(minPuntuation);
    let maxPuntuationNumber = parseInt(maxPuntuation);
    let minYearNumber = parseInt(minYear)
    let maxYearNumber = parseInt(maxYear)

    
    if (!isValidNumber(minPuntuationNumber) || !isValidNumber(maxPuntuationNumber)) throw new CustomError("Min or Maxuntuation are not valid", 400, "failed");
    if (!isValidNumber(minYearNumber) || !isValidNumber(maxYearNumber)) throw new CustomError("Min or Maxear are not valid", 400, "failed");

    const fields = {
        author: parseInt(author) === 1 ? 1 : author,
        videogame: parseInt(videogame) === 1 ? 1 : videogame,
        content: parseInt(content) === 1 ? 1 : content,
        minPuntuation: minPuntuationNumber,
        maxPuntuation: maxPuntuationNumber,
        maxDate: maxYearNumber,
        minDate: minYearNumber
    }



    
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));


    const respond = await commentModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value), commentModel), {
        _id: 0,
        ...selectedFields
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
    if (!respond) throw new CustomError("The docume was not found", 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerComment = (commentModel) => errorWrapper(async (req, res) => {
    const result = validateComment(req.body);
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    const newDocument = await commentModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteComment = (commentModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await commentModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Cannot dele the requested document", 404, "not found");
    
    
    await commentModel.deleteOne(alreadyExist._id);
    res.status(200).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateComment = (commentModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialComment(req.body);

    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    const alreadyExist = await commentModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")
    
    
    const commentUpdated = await commentModel.findOneAndUpdate({_id: alreadyExist._id}, {...result.data}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: commentUpdated
    })    
})