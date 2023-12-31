import { validateDeveloper, validatePartialDeveloper } from "../schemas/developer.js"
import { filters } from "../utils/filterDevelopers.js"
import { capitalize, isValidNumber } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";



export const getDevelopers = (developerModel) => errorWrapper(async (req, res) => {
    const { name, minEmployees, maxEmployees, employeesNumber, foundation, web, minYear, maxYear } = req.query;
    let minEmployeesNumber = parseInt(minEmployees);
    let maxEmployeesNumber = parseInt(maxEmployees);
    let minYearNumber = parseInt(minYear)
    let maxYearNumber = parseInt(maxYear)

    
    if (!isValidNumber(minEmployeesNumber) || !isValidNumber(maxEmployeesNumber)) throw new CustomError("Min or Max number of employees are not valid", 400, "failed");
    if (!isValidNumber(minYearNumber) || !isValidNumber(maxYearNumber)) throw new CustomError("Min or Max year are not valid", 400, "failed");

    const fields = {
        name: parseInt(name) === 1 ? 1 : name,
        number_employees: parseInt(employeesNumber) === 1 ? 1 : employeesNumber,
        foundation: parseInt(foundation) === 1 ? 1 : foundation,
        web: parseInt(web) === 1 ? 1 : web,
        minEmployees: minEmployeesNumber,
        maxEmployees: maxEmployeesNumber,
        maxYear: maxYearNumber,
        minYear: minYearNumber
    }



    
    const selectedFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] === 1));



    const respond = await developerModel.find(filters(Object.entries(fields).filter(([key, value]) => value !== 1 && value), developerModel), {
        _id: 0,
        ...selectedFields
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
    if (!respond) throw new CustomError("The document was not found", 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const result = validateDeveloper(req.body);
    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    
    const alreadyExist = await developerModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(`Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/developers/${alreadyExist._id}`, 409, "redirect");
      

    const newDocument = await developerModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await developerModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Cannot delete the requested document", 404, "not found");
    
    
    await developerModel.deleteOne(alreadyExist._id);
    res.status(200).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateDeveloper = (developerModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const result = validatePartialDeveloper(req.body);

    if (result.error) throw new CustomError(result.error.message, 400, "failed", true);
    
    const alreadyExist = await developerModel.findById(id); 
    if (!alreadyExist) throw new CustomError("Not Found", 404, "not found")
    
    
    const developerUpdated = await developerModel.findOneAndUpdate({_id: alreadyExist._id}, {...result.data}, {
        new: true
    });
    res.status(200).json({
        staus: "success",
        data: developerUpdated
    })    
})