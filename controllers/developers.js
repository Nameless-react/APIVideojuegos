import { validateDeveloper, validatePartialDeveloper } from "../schemas/developer.js"
import { filters } from "../utils/filterDevelopers.js"
import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";



export const getDevelopers = (developerModel) => errorWrapper(async (req, res) => {
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

    if ((minEmployeesNumber && isNaN(minEmployeesNumber)) || (maxEmployeesNumber && isNaN(maxEmployeesNumber))) throw new CustomError(JSON.stringify({message: "Min or Max number of employees are not valid"}), 400, "failed");

    const respond = await developerModel.find(filters(Object.entries(req.query)), {
        _id: 0,
        ...finalFields
    });
    

    res.json({
        status: "success",
        data: respond
    });
})

export const getDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await developerModel.findOne({name: {$regex: regexName}}) : await developerModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const result = validateDeveloper(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await developerModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/developers/${alreadyExist._id}`}), 409, "redirect");
      

    const newDocument = await developerModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await developerModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await developerModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateDeveloper = (developerModel) => errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialDeveloper(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await developerModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const developerUpdated = await developerModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: developerUpdated
    })    
})