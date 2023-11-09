
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import config from "./config.js";


const db = await open({
  filename: config.sqliteDb,
  driver: sqlite3.Database,
});
await db.exec(`
  CREATE TABLE IF NOT EXISTS Urls(
    code       TEXT PRIMARY KEY,
    url        TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    created_by TEXT,
    hits       INTEGER NOT NULL,
    last_hit   INTEGER
  );`);

export async function getUrl(code) {
  const result = await db.get(`
      SELECT url
      FROM Urls
      WHERE code = ?;`,
    code);
  if (result?.url === undefined) {
    return null;
  }
  await db.run(`
      UPDATE Urls
      SET hits = hits + 1,
          last_hit = UNIXEPOCH()
      WHERE code = ?;`,
    code);
  const url = String(result.url);
  return url;
}


export async function createCode(url, code, createdBy) {
  if (typeof (url) !== "string" ||
    typeof (code) !== "string" ||
    (typeof (createdBy) !== "string" && createdBy !== undefined)) {
    return null;
  }

  let result;
  try {
    result = await db.run(`
          INSERT INTO Urls(code, url, created_at, created_by, hits, last_hit)
          VALUES (?, ?, UNIXEPOCH(), ?, 0, NULL);
        `, code, url, createdBy);
  } catch (e) {
    if (e?.code == "SQLITE_CONSTRAINT") {
      throw "Code already in use";
    }
  }
  if (result?.lastID === undefined) {
    return null;
  }

  return code;
}
