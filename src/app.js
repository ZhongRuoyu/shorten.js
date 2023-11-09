import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";

import { generateCode, isValidCode } from "./code.js";
import config from "./config.js";
import { getUrl, createCode } from "./db.js";
import logger from "./logger.js";
import { isValidHttpUrl } from "./url.js";


const app = express();
app.set("trust proxy", true);
app.use(helmet());
app.use(bodyParser.text({ type: "*/*" }));

app.get("/", (req, res) => {
  if (config.mainPage !== undefined) {
    res.redirect(302, config.mainPage);
    return;
  }

  res.send("Hello, world");
});

app.get("/:code", async (req, res) => {
  const code = req.params.code;
  const ip = req.ip;

  const url = await getUrl(code);
  if (url === null) {
    logger.info(`${ip} GET ${req.url} [Not found]`);
    res.status(404).send("Not found");
    return;
  }

  logger.info(`${ip} GET ${req.url} => ${url}`);
  res.redirect(302, url);
});

app.post("/:code?", async (req, res) => {
  const url = String(req.body).trim();
  const ip = req.ip;
  const customCode = req.params.code;

  if (!isValidHttpUrl(url)) {
    logger.info(`${ip} POST ${req.url} (${url}) [Invalid URL]`);
    res.status(400).send("Invalid URL");
    return;
  }

  if (customCode !== undefined && !isValidCode(customCode)) {
    logger.info(`${ip} POST ${req.url} (${url}) [Invalid code]`);
    res.status(400).send("Invalid code");
    return;
  }

  let code;
  if (customCode === undefined) {
    for (let attempt = 0; attempt < 3; ++attempt) {
      try {
        code = await createCode(url, generateCode(config.codeLength), ip);
        if (code !== null) {
          break;
        }
      } catch (_) {
        ;
      }
    }
  } else {
    try {
      code = await createCode(url, customCode, ip);
    } catch (e) {
      logger.info(`${ip} POST ${req.url} (${url}) [${e}]`);
      res.status(400).send(e);
      return;
    }
  }
  if (code === null) {
    logger.info(`${ip} POST ${req.url} (${url}) [Error]`);
    res.status(400).send("Error");
    return;
  }

  const newUrl = `${config.urlPrefix}${code}`;
  logger.info(`${ip} POST ${req.url} (${url}) => ${newUrl}`);
  res.send(newUrl);
});

export default app;
