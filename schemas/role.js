import z from "zod";


const roleValidations = z.object({
    name: z.string({
        invalid_type_error: "The name must be a string",
        required_error: "The field name is required"    
    }),
    description: z.string({
        invalid_type_error: "The description must be a string",
        required_error: "The field description is required"
    })
})


export const validateRole = (object) => roleValidations.safeParse(object);
export const validatePartialRole = (object) => roleValidations.partial().safeParse(object);