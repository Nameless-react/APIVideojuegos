import { Schema, model } from "mongoose";
import z from "zod";


const developerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    foundation: {
        type: Date,
        required: true
    },
    number_employees: {
        type: Number,
        required: true
    },
    web: String
})


const developerValidations = z.object({
    name: z.string({
        invalid_type_error: "Developer's name must be a string",
        required_error: "The field name is required"
    }),
    foundation: z.string().refine(value => {
        const date = new Date(value);
        if (isNaN(date)) return false;
        return date < new Date();
    },{
        invalid_type_error: "Foundation must be a date",
        required_error: "The field foundation is required"
        
    }),
    number_employees: z.number({
        invalid_type_error: "The number of employees must be a number",
        required_error: "The field nmber_employees is required"    
    }).int().positive({
        message: "The number of employees must be positive"
    }),
    web: z.string({
        invalid_type_error: "The url of the web must be a string",
        required_error: "The field web is required"        
    }).url({
        message: "Invalid url for web"
    })

})

export const validateDeveloper = (object) =>  developerValidations.safeParse(object);
export const validatePartialDeveloper = (object) =>  developerValidations.partial().safeParse(object);


export default model("developer", developerSchema);