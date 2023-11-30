import rolModel from "../db/team.js";

const operations = {
    name: (query, name) => {
        let regex = new RegExp(name, "i");
        return query.where("name").regex(regex);
    }
}

export function filters(args) {
    if (args.length === 0) return {};
    let query = rolModel.find();
    let modifications = 0;
    for (const [func, values] of args) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}