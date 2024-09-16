import { Socket } from "net";
import { Request, getRequestFromBuffer } from "@shared";

type RequestHandler = (request: Request, connection: Connection) => void;

export class Connection {
  private cbMap = new Map<string, RequestHandler>();
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;

    this.socket.on("data", (buffer) => {
      const request = getRequestFromBuffer(buffer);
      if (!request) return;

      const { url } = request;
      if (!this.cbMap.has(url)) return;

      const cb = this.cbMap.get(url);
      cb?.(request, this);
    });
  }

  on(url: string, cb: RequestHandler) {
    this.cbMap.set(url, cb);
  }

  send(buffer: Buffer) {
    this.socket.write(buffer);
  }
}
