import { validateDlc, validatePartialDlc } from "../schemas/dlc.js"
import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";
import { filters } from "../utils/filterRol.js";


export const getRoles = (roleModel) => errorWrapper(async (req, res) => {
    const { name } = req.query;    
    const fields = {
        name: parseInt(name) === 1 ? 1 : name,
    }
    
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));

    const respond = await roleModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value)), {
        _id: 0,
        ...selectedFields
    });
    

    res.json({
        status: "success",
        data: respond
    });
})

export const getRole = (roleModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await roleModel.findOne({name: {$regex: regexName}}) : await roleModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerRole = (roleModel) => errorWrapper(async (req, res) => {
    const result = validateDlc(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await roleModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/dlcs/${alreadyExist._id}`}), 409, "redirect");
      

    const newDocument = await dlcModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteRole = (roleModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await roleModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await roleModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateRole = (roleModel) => errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialDlc(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await roleModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const dlcUpdated = await roleModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: dlcUpdated
    })    
})