import userModel from "../db/user.js";

const operations = {

    name: (query, name) => {
        let regex = new RegExp(title, "i");
        return query.where("name").regex(regex);
    },
    email: (query, email) => {
        let regex = new RegExp(title, "i");
        return query.where("email").regex(regex);
    },
    roles: (query, roles) => {
        return query.where("roles").in(roles);
    }
}

export function filters(args) {
    if (args.length === 0) return {};
    let query = userModel.find();
    let modifications = 0;
    for (const [func, values] of args) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}