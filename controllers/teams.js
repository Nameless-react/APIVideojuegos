import { validateTeam, validatePartialTeam } from "../schemas/team.js"
;import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"
import errorWrapper from "../utils/errorWrapper.js";
import { CustomError } from "../utils/customError.js";




export const getTeams = (teamModel) => errorWrapper(async (req, res) => {
    const { name, description, achievements, games} = req.query;

    const fields = {
        name: parseInt(name) === 1,
        description,
        achievements,
        games
    }
    const finalFields = Object.fromEntries(Object.entries(fields).filter(field => field[1]).map(field => [field[0], parseInt(field[1])]));

    const respond = await teamModel.find({}, {
        _id: 0,
        ...finalFields
    });
    

    res.json({
        status: "success",
        data: respond
    });
})

export const getTeam = (teamModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    let regexName = new RegExp(capitalize(id), "i");        
    const respond = id.length < 24 ? await teamModel.findOne({name: {$regex: regexName}}) : await teamModel.findById(id, {__v: 0}); 
    if (!respond) throw new CustomError(JSON.stringify({message: "The document was not found"}), 404, "not found");

    res.status(200).json({
        status: "success",
        data: respond
    })
})


export const registerTeam = (teamModel) => errorWrapper(async (req, res) => {
    const result = validateTeam(req.body);
    if (result.error) throw new CustomError(result.error.message, 400);
    
    
    const alreadyExist = await teamModel.findOne({name: capitalize(result.data.name)});
    if (alreadyExist) throw new CustomError(JSON.stringify({message: `Resource already exist in the database, follow the next link to find the data: http://localhost:${config.port}/teams/${alreadyExist._id}`}), 409, "redirect");
      

    const newDocument = await teamModel.create({...result.data})

    res.status(201).json({
        status: "success",
        data: result.data
    })
})

export const deleteTeam = (teamModel) => errorWrapper(async (req, res) => {
    const { id } = req.params;
    const alreadyExist = await teamModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Cannot delete the requested document"}), 404, "not found");
    
    
    await teamModel.deleteOne(alreadyExist._id);
    return res.status(204).json({
        status: "success",
        message: "The document was deleted succesfully"
    })
})

export const updateTeam = (teamModel) => errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const result = validatePartialTeam(req.body);

    if (result.error) throw new CustomError(result.error.message, 400);
    
    const alreadyExist = await teamModel.findById(id); 
    if (!alreadyExist) throw new CustomError(JSON.stringify({message: "Not Found"}), 404, "not found")
    
    
    const teamUpdated = await teamModel.updateOne({_id: alreadyExist._id}, {...result.data});
    res.status(200).json({
        staus: "success",
        data: teamUpdated
    })    
})