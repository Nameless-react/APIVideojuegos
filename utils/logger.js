import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

class Logger {
    constructor(name, dir = "./logs", cacheSize = 100) {
        this.name = name;
        if (!fs.existsSync(dir)) fs.mkdirSync("./logs");
        this.path = path.join(dir + `/${new Date().toISOString().split('T')[0]}-${name}.log`);
        this.cacheSize = cacheSize;
        this.cache = [];
        this.dir = dir;
    }

    log (level, message) {
        const output = `${new Date().toLocaleString()} | ${level} | ${chalk.reset(message)}`;
        console.log(message);
        this.cache.push(output);
        if (this.cache.length >= this.cacheSize) {
            fs.appendFileSync(this.path, this.cache.join("\n"))
            this.cache = [];
        }
    }

    info(message) {
        this.log("info", chalk.blue(message))
    }

    debug(message) {

        this.log("debug", chalk.yellow(message))
    }

    trace(message) {
        this.log("trace", chalk.blackBright(message))
    }

    warn(message) {
        const warning = chalk.hex('#FFA500');
        this.log("warn", warning(message))
    }

    error(message) {
        this.log("error", chalk.red(message))
    }

    fatal(message) {
        this.log("fatal", chalk.red(message))
    }

    close() {
        if (!fs.existsSync(this.dir)) fs.mkdirSync("./logs");
        fs.appendFileSync(this.path, this.cache.join("\n") + "\n")
    }
}


export default new Logger("logs");