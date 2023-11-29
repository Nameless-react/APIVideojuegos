import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

class Logger {
    constructor(name, dir = "./logs", cacheSize = 100) {
        this.name = name;
        if (!fs.existsSync(dir)) fs.mkdirSync("./logs");
        this.path = path.join(dir + `/${new Date().toLocaleString().split(',')[0].replaceAll("/", "-")}-${name}.log`);
        this.cacheSize = cacheSize;
        this.cache = [];
        this.dir = dir;
    }

    log (level, message) {
        const output = `${new Date().toLocaleString()} | ${level} | ${message}`;
        this.cache.push(output);
        if (this.cache.length >= this.cacheSize) {
            fs.appendFileSync(this.path, this.cache.join("\n"))
            this.cache = [];
        }
    }

    info(message) {
        this.log("info", message);
        console.log(chalk.blue(message));
    }

    debug(message) {
        this.log("debug", message);
        console.log(chalk.yellow(message));
    }

    trace(message) {
        this.log("trace", message);
        console.log(chalk.blackBright(message));
    }

    warn(message) {
        const warning = chalk.hex('#FFA500');
        this.log("warn", message);
        console.log(warning(message));
    }
    
    error(message) {
        this.log("error", message);
        console.log(chalk.red(message));
    }
    
    fatal(message) {
        this.log("fatal", message);
        console.log(chalk.red(message));
    }

    close() {
        if (!fs.existsSync(this.dir)) fs.mkdirSync("./logs");
        fs.appendFileSync(this.path, this.cache.join("\n") + "\n")
        this.cache = [];
    }
}


export default new Logger("logs");