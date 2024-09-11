import { Request } from "../Request";

export const getRequestFromBuffer = (buffer: Buffer): Request | null => {
  try {
    const jsonString = buffer.toString();
    const json = JSON.parse(jsonString);

    if (!isRequest(json)) return null;

    return json;
  } catch {
    return null;
  }
};

const isRequest = (json: unknown): json is Request => {
  const isObject = json instanceof Object;
  if (!isObject) return false;
  if (!json.hasOwnProperty("url")) return false;
  if (!json.hasOwnProperty("method")) return false;
  if (!json.hasOwnProperty("headers")) return false;
  const isHeadersObject =
    (json as { headers: unknown }).headers instanceof Object;
  if (!isHeadersObject) return false;
  if (!json.hasOwnProperty("body")) return false;
  const isBodyObject = (json as { body: unknown }).body instanceof Object;
  if (!isBodyObject) return false;
  return true;
};
