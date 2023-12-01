const operations = {
    minPrice: (query, min) => {
        return query.where("price").gte(min);
    },
    maxPrice: (query, max) => {
        return query.where("price").lte(max);
    },
    name: (query, name) => {
        let regex = new RegExp(name, "i");
        return query.where("name").regex(regex);
    },
    minRelease: (query, year) => {
        const date = new Date(`${year}-01-01T23:59:59Z`);
        return query.where("release_date").gte(date);
    },
    maxRelease: (query, year) => {
        const date = new Date(`${year}-12-31T23:59:59Z`);
        return query.where("release_date").lte(date);
    },
    videogame: (query, title) => {
        let regex = new RegExp(title, "i");
        return query.where("videogame").regex(regex);
    }
}

export function filters(options, dlcModel) {
    if (options.length === 0) return {};
    let query = dlcModel.find();
    let modifications = 0;
    for (const [func, values] of options) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}