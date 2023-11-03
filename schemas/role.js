import z from "zod";


const roleValidations = z.object({

})


export const validateRole = (object) => roleValidations.safeParse(object);
export const validatePartialRole = (object) => roleValidations.partial().safeParse(object);