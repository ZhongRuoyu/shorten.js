import dotenv from "dotenv";


dotenv.config();

function getenv(name) {
  return process.env[name] || "";
}

const listenPort = getenv("LISTEN_PORT");
const urlPrefix = getenv("URL_PREFIX");
const mainPage = getenv("MAIN_PAGE");
const codeLength = getenv("CODE_LENGTH");
const sqliteDb = getenv("SQLITE_DB");
const logFile = getenv("LOG_FILE");

const config = {
  listenPort: Number(listenPort || 8080),
  urlPrefix: (() => {
    if (urlPrefix !== "") {
      return urlPrefix;
    }

    const suffix = listenPort === "80" ? "" : `:${listenPort || 8080}`;
    return `http://localhost${suffix}/`;
  })(),
  mainPage: mainPage || undefined,
  codeLength: Number(codeLength || 4),
  sqliteDb: sqliteDb || ":memory:",
  logFile: logFile || "access.log",
};

export default config;
