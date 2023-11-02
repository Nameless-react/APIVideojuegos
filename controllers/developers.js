import developer, { validateDeveloper, validatePartialDeveloper } from "../db/developer.js"
import { filters } from "../utils/filterDevelopers.js"
import { isValidObjectId } from "mongoose";
import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";

export const getDevelopers = errorWrapper(async (req, res) => {
    const { name, minEmployees, maxEmployees, employeesNumber, foundation, web} = req.query;
    let minEmployeesNumber = parseInt(minEmployees);
    let maxEmployeesNumber = parseInt(maxEmployees);

    const fields = {
        name: parseInt(name) === 1,
        number_employees: employeesNumber,
        foundation,
        web
    }
    const finalFields = Object.fromEntries(Object.entries(fields).filter(field => field[1]).map(field => [field[0], parseInt(field[1])]));

    if ((minEmployeesNumber && isNaN(minEmployeesNumber)) || (maxEmployeesNumber && isNaN(maxEmployeesNumber))) throw new CustomError(JSON.stringify({status: "failed", message: "Min or Max number of employees are not valid"}), 400);

    const respond = await developer.find(filters(Object.entries(req.query)), {
        _id: 0,
        ...finalFields
    });
    

    res.json({
        status: "success",
        data: [respond]
    });
})

export const getDeveloper = errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await developer.findOne({name: {$regex: regexName}}) : await developer.findById(id, {versionKey: 0}); 

    res.json({
        status: "success",
        data: respond
    })
})


export const registerDeveloper = errorWrapper(async (req, res) => {
    const result = validateDeveloper(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await developer.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({status: "redirect", message: `Resource already exist in the data base, follow the next link to find the data: http://localhost:${config.port}/developers/${alreadyExist._id}`}), 409);
      

    const newDocument = await developer.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteDeveloper = errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await developer.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({status: "failed", message: "Cannot delete the requested document"}), 404);
    
    
    await developer.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateDeveloper = errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialDeveloper(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    if (!isValidObjectId(id)) throw new CustomError(JSON.stringify({status: "failed", message: "The id must be a string of 12 bytes or a string of 24 hex characters or an integer"}), 500)
    
    const alreadyExist = await developer.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({status: "failed", message: "Not Found"}), 404)
    
    
    const developerUpdated = await developer.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: developerUpdated
    })    
})