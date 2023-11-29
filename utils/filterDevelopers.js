import developer from "../db/developer.js";

const operations = {
    minEmployees: (query, min) => {
        return query.where("number_employees").gte(min);
    },
    maxEmployees: (query, max) => {
        return query.where("number_employees").lte(max);
    },
    name: (query, name) => {
        let regex = new RegExp(name, "i");
        return query.where("name").regex(regex);
    },
    minYear: (query, year) => {
        return query.where("foundation").gte(new Date(year));
    },
    maxYear: (query, year) => {
        return query.where("foundation").lte(new Date(year));
    }
}

export function filters(args) {
    if (args.length === 0) return {};
    let query = developer.find();
    let modifications = 0;
    for (const [func, values] of args) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}