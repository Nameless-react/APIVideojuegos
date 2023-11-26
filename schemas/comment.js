import z from "zod";

const commentValidations = z.object({
    name: z.string({
        invalid_type_error: "The name must be a string",
        required_error: "The field name is required"
    }),
    foundation: z.string().refine(value => {
        const date = new Date(value);
        if (isNaN(date)) return false;
        return date < new Date();
    },{
        invalid_type_error: "The Foundation must be a date",
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

export const validateComment = (object) =>  commentValidations.safeParse(object);
export const validatePartialComment = (object) =>  commentValidations.partial().safeParse(object);