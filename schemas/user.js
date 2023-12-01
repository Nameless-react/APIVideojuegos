import z from "zod";

const userValidations = z.object({
    name: z.string({
        invalid_type_error: "The name must be a string",
        required_error: "The field name is required"
    }),
    email: z.string({
        invalid_type_error: "The email must be a string",
        required_error: "The field email is required"
    }).email({
        message: "Invalid email address"
    }),
    password: z.string({
        invalid_type_error: "The password must be a string",
        required_error: "The field password is required"
    }).min(8, {
        message: "Password must have more than 8 characters"
    })
})


const userRoleValidation = z.object({
    role: z.string({
        invalid_type_error: "The role must be a string",
        required_error: "The field role is required"
    })
})


export const validateUserRole = (object) => userRoleValidation.safeParse(object);
export const validateUser = (object) => userValidations.safeParse(object);
export const validatePartialUser = (object) => userValidations.partial().safeParse(object);