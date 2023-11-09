import winston from "winston";

import config from "./config.js";


const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: config.logFile }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;
