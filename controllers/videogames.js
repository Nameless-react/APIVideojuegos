import { validatePartialVideogame, validateVideogame } from "../schemas/videogame.js";
import { capitalize, isValidNumber } from "../utils/utils.js";
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";
import { filters } from "../utils/filterVideogames.js";


export const getVideogames = (videogameModel) => errorWrapper(async (req, res) => {
        
    const { title, description, releaseDate, developer, genre, image, minRelease, maxRelease } = req.query;
    let maxReleaseDateNumber = parseInt(maxRelease);
    let minReleaseDateNumber = parseInt(minRelease);
    

    
    if (!isValidNumber(minReleaseDateNumber) || !isValidNumber(maxReleaseDateNumber)) throw new CustomError("Min or Max year of the release of the videogame are not valid", 400, "failed");
    
    const fields = {
        title: parseInt(title) === 1 ? 1 : title,
        description: parseInt(description) === 1 ? 1 : description,
        releaseDate: parseInt(releaseDate) === 1 ? 1 : releaseDate,
        developer: parseInt(developer) === 1 ? 1 : developer,
        genre: parseInt(genre) === 1 ? 1 : (genre && genre.split(",")),
        image: parseInt(image) === 1 ? 1 : image,
        minRelease: minReleaseDateNumber,
        maxRelease: maxReleaseDateNumber
    }
    
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));


    const respond = await videogameModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value), videogameModel), {
        _id: 0,
        ...selectedFields
    });

    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const getVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i"); 
    const respond = id.length < 24 ? await videogameModel.findOne({name: {$regex: regexName}}) : await videogameModel.findById(id, {__v: 0}); 
    
    if (!respond) throw new CustomError("The document was not found", 404, "not found")

    res.status(200).json({
        status: "success",
        data: respond
    })
})

export const registerVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const result = validateVideogame(req.body);
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);

    const alreadyExist = await videogameModel.findOne({title: result.data.title});
    if (alreadyExist) throw new CustomError(`Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/videogames/${alreadyExist._id}`, 409, "redirect");
    
    const newDocument = await videogameModel.create({...result.data});
    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await videogameModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Cannot delete the requested document", 404, "failed");
    
    
    await videogameModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateVideogame = (videogameModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialVideogame(req.body);

    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    const alreadyExist = await videogameModel.findById(id); 
    if (!alreadyExist) throw new CustomError("The document was not found", 404, "not found")
    
    
    const videogameUpdated = await videogameModel.findOneAndUpdate({_id: alreadyExist._id}, {...result.data}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: videogameUpdated
    })    
})