import { Request, Response } from "@shared";
import { Connection } from "@server/Connection";
import { userConnectionMapper } from "@server/UserConnectionMapper";

const ErrorResponse: Response = {
  code: 401,
  body: { error: "Not Authorized!" },
};

export const getMessage = (request: Request, connection: Connection) => {
  const messageOwnerUuid = request.headers.uuid;

  const messageText = request.body.messageText;

  const messageOwner = userConnectionMapper.getUserByUuid(messageOwnerUuid);

  if (!messageOwner) {
    const errorResponseBuffer = Buffer.from(JSON.stringify(ErrorResponse));
    return connection.send(errorResponseBuffer);
  }

  const allConnections = userConnectionMapper.getAllConnections();

  for (const userConnection of allConnections) {
    const login = messageOwner.login;

    const response: Response = {
      code: 200,
      body: { login, messageText, ownerUuid: messageOwnerUuid },
    };

    const responseBuffer = Buffer.from(JSON.stringify(response));

    userConnection.send(responseBuffer);
  }
};
