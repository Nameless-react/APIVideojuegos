import z from "zod";

const commentValidations = z.object({
    content: z.string({
        invalid_type_error: "The content must be a string",
        required_error: "The field content is required"
    }),
    puntuation: z.number({
        invalid_type_error: "The puntuation must be a number",
        required_error: "The field puntuation is required"
    }).positive({
        message: "The puntuation must be greater than zero"
    }),
    videogame: z.string({
        invalid_type_error: "The videogame must be a string",
        required_error: "The field videogame is required"
    }),
    date: z.string().refine(value => {
        const date = new Date(value);
        if (isNaN(date)) return false;
        return date < new Date();
    },{
        invalid_type_error: "The date of the comment must be a date",
        required_error: "The field date is required"
    }),
    author: z.string({
        invalid_type_error: "The author must be a string",
        required_error: "The field author is required"
    }),
})

export const validateComment = (object) =>  commentValidations.safeParse(object);
export const validatePartialComment = (object) =>  commentValidations.partial().safeParse(object);