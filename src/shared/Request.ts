export interface Request {
  url: string;
  method: "POST" | "PUT" | "UPDATE" | "GET";
  headers: Record<string, string>;
  body: ReturnType<typeof JSON.parse>;
}
