import { customAlphabet } from "nanoid";


const alphabet =
  "0123456789" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "abcdefghijklmnopqrstuvwxyz";
// const alphabetRegex = /^[0-9A-Za-z]+$/;
const codeRegex = /^[-_0-9A-Za-z]+$/;

const nanoid = customAlphabet(alphabet);

export function generateCode(length) {
  return nanoid(length);
}

export function isValidCode(code) {
  return codeRegex.test(code);
}
