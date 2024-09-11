import { Socket } from "net";
import { Request } from "@shared/Request";
import { getRequestFromBuffer } from "@shared/getRequestFromBuffer";

type RequestHandler = (request: Request) => void;

export class Connection {
  private cbMap = new Map<string, RequestHandler>();

  constructor(socket: Socket) {
    socket.on("data", (buffer) => {
      const request = getRequestFromBuffer(buffer);
      if (!request) return;

      const { url } = request;
      if (!this.cbMap.has(url)) return;

      const cb = this.cbMap.get(url);
      cb?.(request);
    });
  }

  on(url: string, cb: RequestHandler) {
    this.cbMap.set(url, cb);
  }
}
