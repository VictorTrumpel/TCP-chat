export interface Response {
  code: number;
  body: ReturnType<typeof JSON.parse>;
}
