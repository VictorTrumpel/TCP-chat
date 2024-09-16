import { Socket, Server } from "net";
import { Connection } from "./Connection";
import { authRequest } from "./handlers/authRequest";
import { closeRequest } from "./handlers/closeRequest";

const PORT = 8000;

const server = new Server();

const connection = (socket: Socket) => {
  const connection = new Connection(socket);

  connection.on("/auth", authRequest);
  connection.onClose(closeRequest);
};

server.listen(8000);

server.on("listening", () => {
  console.log(`Сервер работает на ${PORT} порту`);
});

server.on("connection", connection);
