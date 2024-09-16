import { Request, Response } from "@shared";
import { userConnectionMapper } from "@server/UserConnectionMapper";
import { Connection } from "@server/Connection";

export const authRequest = (request: Request, connection: Connection) => {
  const password = request.body.password;
  const login = request.body.login;

  const user = { password, login };

  const userUuid = userConnectionMapper.addUserConnection(user, connection);

  const response: Response = {
    code: 200,
    body: { uuid: userUuid },
  };

  const responseBuffer = Buffer.from(JSON.stringify(response), "utf8");

  connection.send(responseBuffer);
};
