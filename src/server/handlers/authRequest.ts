import { Request } from "@shared";

export const authRequest = (request: Request) => {
  const password = request.body.password;
  const login = request.body.login;

  console.table({ password, login });
};
