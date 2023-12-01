const operations = {
    achievements: (query, achieve) => {
        return query.where("achievements").in(achieve);
    },
    games: (query, game) => {
        return query.where("games").in(game);
    },
    name: (query, name) => {
        let regex = new RegExp(name, "i");
        return query.where("name").regex(regex);
    }
}

export function filters(options, teamModel) {
    if (options.length === 0) return {};
    let query = teamModel.find();
    let modifications = 0;
    for (const [func, values] of options) {
        if (!operations[func]) continue;
        modifications++;
        query = operations[func](query, values)
    }

    if (modifications === 0) return {};
    return query;
}