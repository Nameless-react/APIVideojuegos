import videogame, { validatePartialVideogame, validateVideogame } from "../db/videogame.js"
import { Types } from "mongoose";
import { capitalize } from "../utils/utils.js";

export const getVideogames = async (req, res) => {
    try {
        const respond = await videogame.find();
        res.status(200).json({
            status: "success",
            data: [respond]
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message,
            data: []
        });
    }
}

export const getVideogame = (req, res) => {

}

export const registerVideogame = (req, res) => {

}
export const deleteVideogame = (req, res) => {

}

export const updateVideogame = (req, res) => {

}