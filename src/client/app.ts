import { Socket } from "net";
import { Request } from "@shared/Request";

const socket = new Socket();

const connection = () => {
  const request: Request = {
    url: "/auth",
    method: "POST",
    headers: {},
    body: {},
  };

  const buffer = Buffer.from(JSON.stringify(request), "utf8");

  socket.write(buffer);
};

socket.connect({ port: 8000 }, connection);

socket.on("data", (data) => {
  console.log("Сервер ответил :>> ", data.toString());
});
