import z from "zod";

const teamValidations = z.object({
    name: z.string({
        invalid_type_error: "The name must be a string",
        required_error: "The field name is required"
    }),
    description: z.string({
        invalid_type_error: "The description must be a string",
        required_error: "The field description is required"    
    }),
    achievements: z.array(z.string({
        invalid_type_error: "The achievements must be a string",
    })),
    games: z.array(z.string({
        invalid_type_error: "The games must be a string",
    }))
})

export const validateTeam = (object) =>  teamValidations.safeParse(object);
export const validatePartialTeam = (object) =>  teamValidations.partial().safeParse(object);