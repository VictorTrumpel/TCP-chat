import { clientSocket } from "./Socket";
import { Input } from "./ui/Input";
import { passRegistration } from "./passRegistration";

const connection = async () => {
  const userUuid = await passRegistration(clientSocket);

  console.log("userUuid :>> ", userUuid);

  const responses: Buffer[] = [];

  clientSocket.on("data", (buffer) => {
    responses.push(buffer);
  });

  while (true) {
    const message = await Input();
    clientSocket.write(message);
    console.log("responses.length :>> ", responses.length);
  }
};

clientSocket.connect({ port: 8000 }, connection);
