export function isValidHttpUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch (_) {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return false;
  }
  return true;
}
