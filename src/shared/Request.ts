export interface Request {
  url: string;
  method: "POST" | "PUT" | "UPDATE" | "GET" | "DELETE";
  headers: Record<string, string>;
  body: ReturnType<typeof JSON.parse>;
}
