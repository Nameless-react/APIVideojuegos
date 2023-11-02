import z from "zod";

const videogameValidations = z.object({
    title: z.string({
        invalid_type_error: "The title must be a string",
        required_error: "The field title is required"
    }),
    description: z.string({
        invalid_type_error: "The description must be a string",
        required_error: "The field description is required"    
    }),
    release_date: z.string().refine(value => {
        const date = new Date(value);
        if (isNaN(date)) return false;
        return date < new Date();
    },{
        invalid_type_error: "The realease_date must be a date",
        required_error: "The field release_date is required"
    }),
    developer: z.string({
        invalid_type_error: "The developer must be a string",
        required_error: "The field developer is required"
    }),
    genre: z.array(z.enum([
        "Action",
        "Adventure",
        "Role-Playing (RPG)",
        "Strategy",
        "Shooter",
        "Sports",
        "Racing",
        "Simulation",
        "Fighting",
        "Puzzle",
        "Platformer",
        "Horror",
        "Music/Rhythm",
        "Educational",
        "Real-Time Strategy (RTS)",
        "Open World",
        "Stealth",
        "Sandbox",
        "Graphic Adventure",
        "Turn-Based Strategy",
        "Building",
        "Card/Collectible Card",
        "Roguelike",
        "Massively Multiplayer Online (MMO)",
        "Battle Royale",
        "eSports",
        "Visual Novel",
        "Multiplayer",
        "Social Simulation",
        "Life Simulation",
        "Metroidvania"
      ]), {
        invalid_type_error: "The genre must be a string",
      }),
      image: z.string({
        invalid_type_error: "The image must be a string",
      }).url({
        message: "The image url is not valid"
      })
})

export const validateVideogame = (object) => videogameValidations.safeParse(object);
export const validatePartialVideogame = (object) => videogameValidations.partial().safeParse(object);