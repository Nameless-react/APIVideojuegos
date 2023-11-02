import videogame from "../db/videogame.js"
import { validatePartialVideogame, validateVideogame } from "../schemas/videogame.js";
import { isValidObjectId } from "mongoose";
import { capitalize } from "../utils/utils.js";
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";


export const getVideogames = errorWrapper(async (req, res) => {
    const respond = await videogame.find();
    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const getVideogame = errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i"); 
    const respond = id.length < 24 ? await videogame.findOne({name: {$regex: regexName}}) : await videogame.findById(id, {versionKey: 0}); 
    
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found")

    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const registerVideogame = errorWrapper(async (req, res) => {
    const result = validateVideogame(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);

    const alreadyExist = await videogame.findOne({title: result.data.title});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the data base, follow the next link to find the data: http://localhost:${config.port}/videogames/${alreadyExist._id}`}), 409, "redirect");
    
    const newDocument = await videogame.create({...result.data});
    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteVideogame = errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await videogame.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "failed");
    
    
    await videogame.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateVideogame = errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialVideogame(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    if (!isValidObjectId(id)) throw new CustomError(JSON.stringify({message: "The id must be a string of 12 bytes or a string of 24 hex characters or an integer"}), 500, "failed")
    
    const alreadyExist = await videogame.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found")
    
    
    const videogameUpdated = await videogame.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: videogameUpdated
    })    
})