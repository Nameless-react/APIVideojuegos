import developer from "../db/developer.js"

export const getDevelopers = async (req, res) => {
    const respond = await developer.find();
    res.json(respond);
    // res.json({"message": "hola"})
}

export const getDeveloper = (req, res) => {

}


export const registerDeveloper = (req, res) => {

}

export const deleteDeveloper = (req, res) => {

}

export const updateDeveloper = (req, res) => {

}