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
        const date = new Date(`${year}-01-01T23:59:59Z`);
        return query.where("foundation").gte(date);
    },
    maxYear: (query, year) => {
        const date = new Date(`${year}-12-31T23:59:59Z`);
        return query.where("foundation").lte(date);
    }
}

export function filters(options, developerModel) {
    if (options.length === 0) return {};
    let query = developerModel.find();
    let modifications = 0;
    for (const [func, values] of options) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}