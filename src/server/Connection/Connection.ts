import { Socket } from "net";
import { Request, getRequestFromBuffer } from "@shared";

type RequestHandler = (request: Request, connection: Connection) => void;

export class Connection {
  private cbMap = new Map<string, RequestHandler>();
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;

    this.socket.on("data", this.handleData);
    this.socket.on("close", this.handleClose);
  }

  on(url: string, cb: RequestHandler) {
    this.cbMap.set(url, cb);
  }

  onClose(cb: RequestHandler) {
    this.cbMap.set("close", cb);
  }

  send(buffer: Buffer) {
    this.socket.write(buffer);
  }

  private handleClose = () => {
    const request: Request = {
      url: "",
      method: "DELETE",
      headers: {},
      body: {},
    };
    const cb = this.cbMap.get("close");
    cb?.(request, this);
  };

  private handleData = (buffer: Buffer) => {
    const request = getRequestFromBuffer(buffer);
    if (!request) return;

    const { url } = request;
    if (!this.cbMap.has(url)) return;

    const cb = this.cbMap.get(url);
    cb?.(request, this);
  };
}
