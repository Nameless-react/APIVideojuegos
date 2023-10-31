import developer from "../db/developer.js"
import { filters } from "../utils/filterDevelopers.js"
import { Types } from "mongoose";
import { capitalize } from "../utils/utils.js";
import config from "../config/config.js"


export const getDevelopers = async (req, res) => {
    try {

        const { name, minEmployees, maxEmployees, employeesNumber, foundation, web} = req.query;
        let minEmployeesNumber = parseInt(minEmployees);
        let maxEmployeesNumber = parseInt(maxEmployees);
        const fields = {
            name: parseInt(name) === 1,
            number_employees: employeesNumber,
            foundation,
            web
        }
        const finalFields = Object.fromEntries(Object.entries(fields).filter(field => field[1] ?? false).map(field => [field[0], parseInt(field[1])]));

      


        if ((minEmployeesNumber && isNaN(minEmployeesNumber)) || (maxEmployeesNumber && isNaN(maxEmployeesNumber))) {
            throw Error("Min or Max number of employees are not valid");
        } 

        let respond = await developer.find(filters(Object.entries(req.query)), {
            _id: 0,
            versionKey: 0,
            ...finalFields
        });
        
        
        
        

        res.json({
            status: "success",
            data: [respond]
        });
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e.message,
            data: []
        });
    }
}

export const getDeveloper = async (req, res) => {
    const { id } = req.params;
    let nameId = capitalize(id);
    try {
       
        const respond = id.length < 24 ? await developer.findOne({name: {$eq: nameId}}) : await developer.findOne({_id: {$eq: new Types.ObjectId(id)}}, {versionKey: 0}); 


        res.json({
            status: "success",
            data: [respond]
        })
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e.message,
            data: []
        })
    }
}


export const registerDeveloper = async (req, res) => {
    const { name, foundation, number_employees, web } = req.body;



    if (!name || !foundation || !number_employees || !web) res.status(400).json({message: "Missing require fields"})
    //verificar el guardado de datos
    const alreadyExist = await developer.findOne({name: capitalize(name)});
    if (alreadyExist) {
        return res.status(409).json({
            status: "redirect",
            message: `Resource already exist in the data base, in this link: http://localhost:${config.port}/developers/${alreadyExist._id}`,
            data: []
        })
    }

    const {__v, ...create} = await developer.create({
        name,
        foundation,
        number_employees,
        web
    },)

    res.status(201).json({
        status: "success",
        data: [create]
    })

}

export const deleteDeveloper = async (req, res) => {
    const { id } = req.params;
    let nameId = capitalize(id);

    try {
        const alreadyExist = id.length < 24 ? await developer.findOne({name: {$eq: nameId}}) : await developer.findOne({_id: {$eq: new Types.ObjectId(id)}}); 
        if (alreadyExist) {
            await developer.deleteOne(alreadyExist._id);
            return res.status(204).json({
                status: "success",
                message: "The document was deleted succesfully"
            })
        }
    
        
        res.status(404).json({
            status: "failed",
            message: e.message,
            data: []
        })


    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e.message,
            data: []
        })
    }
}

export const updateDeveloper = async (req, res) => {
    const { id } = req.params;
    const { name, foundation, number_employees, web } = req.body;
    let nameId = capitalize(id);


    const alreadyExist = id.length < 24 ? await developer.findOne({name: {$eq: name}}) : await developer.findOne({_id: {$eq: new Types.ObjectId(id)}}); 
    if (!alreadyExist) return res.status(404).json({status: "failed", message: "Not Found"});
    const finalFields = Object.fromEntries(Object.entries({
        name,
        foundation,
        number_employees,
        web
    }).filter(([field, value]) => value))
    
    const developerUpdated = await developer.updateOne({_id: alreadyExist._id}, {...finalFields});
    res.status(200).json({
        staus: "success",
        data: [developerUpdated]
    })
    
}


