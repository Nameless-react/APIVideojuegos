import z from "zod";

const dlcValidations = z.object({

})



export const validatedlc = (object) => dlcValidations.safeParse(object);
export const validatePartialdlc = (object) => dlcValidations.partial().safeParse(object);