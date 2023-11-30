import videogamesModel from "../db/videogame.js";

const operations = {

    genre: (query, genre) => {
        return query.where("genre").in(genre);
    },
    title: (query, title) => {
        let regex = new RegExp(title, "i");
        return query.where("title").regex(regex);
    },
    developer: (query, developer) => {
        let regex = new RegExp(developer, "i");
        return query.where("developer").regex(regex);
    },
    minRelease: (query, year) => {
        const date = new Date(`${year}-01-01T23:59:59Z`);
        return query.where("release_date").gte(date);
    },
    maxRelease: (query, year) => {
        const date = new Date(`${year}-12-31T23:59:59Z`);
        return query.where("release_date").lte(date);
    }
}

export function filters(args) {
    if (args.length === 0) return {};
    let query = videogamesModel.find();
    let modifications = 0;
    for (const [func, values] of args) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}