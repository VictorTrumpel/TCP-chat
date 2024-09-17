import { v4 as uuidv4 } from "uuid";
import { Connection } from "../Connection";
import { User } from "@shared";

type UserUuid = string;

export class UserConnectionMapper {
  private uuidUserMap = new Map<UserUuid, User>();
  private uuidConnectionMap = new Map<UserUuid, Connection>();

  getAllConnections() {
    return [...this.uuidConnectionMap.values()];
  }

  addUserConnection(user: User, connection: Connection) {
    const uuid = uuidv4();

    this.uuidUserMap.set(uuid, user);
    this.uuidConnectionMap.set(uuid, connection);

    return uuid;
  }

  deleteUserConnectionByUuid(uuid: string) {
    this.uuidUserMap.delete(uuid);
    this.uuidConnectionMap.delete(uuid);
  }

  getUserByUuid(userUuid: string) {
    const connectedUser = this.uuidUserMap.get(userUuid);
    return connectedUser || null;
  }

  getConnectionByUuid(connectionUuid: string) {
    const connection = this.uuidConnectionMap.get(connectionUuid);
    return connection || null;
  }

  getConnectionUuid(needToFindConnection: Connection) {
    for (const [connectionUuid, connection] of this.uuidConnectionMap) {
      if (needToFindConnection !== connection) continue;
      return connectionUuid;
    }
    return null;
  }
}

export const userConnectionMapper = new UserConnectionMapper();
