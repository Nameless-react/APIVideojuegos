import z from "zod";

const dlcValidations = z.object({
    name: z.string({
        invalid_type_error: "The name must be a string",
        required_error: "The field name is required"
    }),
    description: z.string({
        invalid_type_error: "The description must be a string",
        required_error: "The field description is required"
    }),
    price: z.number({
        invalid_type_error: "The price must be a number",
        required_error: "The field price is required"
    }).positive({
        message: "The price must be postivie"
    }),
    release_date: z.string().refine(value => {
        const date = new Date(value);
        if (isNaN(date)) return false;
        return date < new Date();
    },{
        invalid_type_error: "The realease_date must be a date",
        required_error: "The field release_date is required"
    }),
    videogame: z.string({
        invalid_type_error: "The videogame must be a string",
        required_error: "The field videogame is required"
    })
})



export const validateDlc = (object) => dlcValidations.safeParse(object);
export const validatePartialDlc = (object) => dlcValidations.partial().safeParse(object);