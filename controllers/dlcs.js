import { validateDlc, validatePartialDlc } from "../schemas/dlc.js"
import { capitalize, isValidNumber } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";
import { filters } from "../utils/filterDlc.js";

export const getDlcs = (dlcModel) => errorWrapper(async (req, res) => {
    const { name, description, price, releaseDate, videogame, minRelease, maxRelease, minPrice, maxPrice } = req.query;
    let maxReleaseDateNumber = parseInt(maxRelease);
    let minReleaseDateNumber = parseInt(minRelease);
    let maxPriceNumber = parseInt(maxPrice);
    let minPriceNumber = parseInt(minPrice);


    if (!isValidNumber(minReleaseDateNumber) || !isValidNumber(maxReleaseDateNumber)) throw new CustomError(JSON.stringify({message: "Min or Max year of the release of the videogame are not valid"}), 400, "failed");
    if (!isValidNumber(minPriceNumber) || !isValidNumber(maxPriceNumber)) throw new CustomError(JSON.stringify({message: "Min or Max price are not valid"}), 400, "failed");


    const fields = {
        name: parseInt(name) === 1 ? 1 : name,
        description: parseInt(description) === 1 ? 1 : description,
        price: parseInt(price) === 1 ? 1 : price,
        videogame: parseInt(videogame) === 1 ? 1 : videogame,
        releaseDate: parseInt(releaseDate) === 1 ? 1 : releaseDate,
        minPrice: minPriceNumber,
        maxPrice: maxPriceNumber,
        minRelease: minReleaseDateNumber,
        maxRelease: maxReleaseDateNumber
    }


    
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));


    const respond = await dlcModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value)), {
        _id: 0,
        ...selectedFields
    });
    

    res.json({
        status: "success",
        data: respond
    });
})

export const getDlc = (dlcModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await dlcModel.findOne({name: {$regex: regexName}}) : await dlcModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerDlc = (dlcModel) => errorWrapper(async (req, res) => {
    const result = validateDlc(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await dlcModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/dlcs/${alreadyExist._id}`}), 409, "redirect");
      

    const newDocument = await dlcModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteDlc = (dlcModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await dlcModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await dlcModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateDlc = (dlcModel) => errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialDlc(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await dlcModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const dlcUpdated = await dlcModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: dlcUpdated
    })    
})