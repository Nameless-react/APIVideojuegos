import z from "zod";

const userValidations = z.object({

})


export const validateUser = (object) => userValidations.safeParse(object);
export const validatePartialUser = (object) => userValidations.partial().safeParse(object);