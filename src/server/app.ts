import { Socket, Server } from "net";
import { Connection } from "./Connection";

const PORT = 8000;

const server = new Server();

const connection = (socket: Socket) => {
  const connection = new Connection(socket);

  connection.on("/auth/register", (request) => {
    console.log("request :>> ", request);
    // запрос на регистрацию
  });

  connection.on("/auth", (request) => {
    console.log("request :>> ", request);
    // запрос на авторизацию
  });
};

server.listen(8000);

server.on("listening", () => {
  console.log(`Сервер работает на ${PORT} порту`);
});

server.on("connection", connection);
