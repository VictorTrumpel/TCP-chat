import { Request } from "@shared";
import { Connection } from "@server/Connection";
import { userConnectionMapper } from "@server/UserConnectionMapper";

export const closeRequest = (_: Request, connection: Connection) => {
  const connectionUuid = userConnectionMapper.getConnectionUuid(connection);
  if (!connectionUuid) return;
  userConnectionMapper.deleteUserConnectionByUuid(connectionUuid);
};
