import commentModel from "../db/videogame.js";

const operations = {

    author: (query, title) => {
        let regex = new RegExp(title, "i");
        return query.where("author").regex(regex);
    },
    minPuntuation: (query, puntuation) => {
        return query.where("puntuation").gte(puntuation);
    },
    maxPuntuation: (query, puntuation) => {
        return query.where("puntuation").lte(puntuation);
    },
    videogame: (query, name) => {
        let regex = new RegExp(name, "i");
        return query.where("videogame").regex(regex);
    },
    minDate: (query, year) => {
        const date = new Date(`${year}-01-01T23:59:59Z`);
        return query.where("date").gte(date);
    },
    maxDate: (query, year) => {
        const date = new Date(`${year}-12-31T23:59:59Z`);
        return query.where("date").lte(date);
    },
}

export function filters(args) {
    if (args.length === 0) return {};
    let query = commentModel.find();
    let modifications = 0;
    for (const [func, values] of args) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}