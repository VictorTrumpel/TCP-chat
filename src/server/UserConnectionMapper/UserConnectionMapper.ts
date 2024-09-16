import { v4 as uuidv4 } from "uuid";
import { Connection } from "../Connection";
import { User } from "@shared";

type UserUuid = string;

export class UserConnectionMapper {
  private uuidUserMap = new Map<UserUuid, User>();
  private uuidConnectionMap = new Map<UserUuid, Connection>();

  addUserConnection(user: User, connection: Connection) {
    const uuid = uuidv4();

    this.uuidUserMap.set(uuid, user);
    this.uuidConnectionMap.set(uuid, connection);

    return uuid;
  }

  getUserByUuid(userUuid: string) {
    const connectedUser = this.uuidUserMap.get(userUuid);
    return connectedUser || null;
  }

  getConnectionByUuid(connectionUuid: string) {
    const connection = this.uuidConnectionMap.get(connectionUuid);
    return connection || null;
  }
}

export const userConnectionMapper = new UserConnectionMapper();
