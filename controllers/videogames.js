import { validatePartialVideogame, validateVideogame } from "../schemas/videogame.js";
import { capitalize } from "../utils/utils.js";
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";


export const getVideogames = (videogameModel) => errorWrapper(async (req, res) => {
    const respond = await videogameModel.find();
    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const getVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i"); 
    const respond = id.length < 24 ? await videogameModel.findOne({name: {$regex: regexName}}) : await videogameModel.findById(id, {__v: 0}); 
    
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found")

    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const registerVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const result = validateVideogame(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);

    const alreadyExist = await videogameModel.findOne({title: result.data.title});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/videogames/${alreadyExist._id}`}), 409, "redirect");
    
    const newDocument = await videogameModel.create({...result.data});
    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await videogameModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "failed");
    
    
    await videogame.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialVideogame(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await videogameModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found")
    
    
    const videogameUpdated = await videogameModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: videogameUpdated
    })    
})