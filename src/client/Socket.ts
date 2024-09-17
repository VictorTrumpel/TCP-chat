import { Socket } from "net";

class ClientSocket extends Socket {
  private _uuid: string | null = null;

  set uuid(uuid: string | null) {
    this._uuid = uuid;
  }

  get uuid() {
    return this._uuid;
  }
}

export const clientSocket = new ClientSocket();
