import { Socket, Server } from "net";
import { Connection } from "./Connection";
import { PORT } from "@shared";
import { registerRequest, closeRequest, getMessage } from "@server/handlers";

const server = new Server();

const connection = (socket: Socket) => {
  const connection = new Connection(socket);

  connection.on("/message", getMessage);
  connection.on("/register", registerRequest);
  connection.onClose(closeRequest);
};

server.on("connection", connection);

server.listen(PORT);

server.on("listening", () => {
  console.log(`Сервер работает на ${PORT} порту`);
});
