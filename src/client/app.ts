import { clientSocket } from "./Socket";
import { PORT } from "@shared";
import { passRegistration } from "./passRegistration";
import { printUserMessage } from "./printUserMessage";
import { startChat } from "./startChat";

const connection = async () => {
  const userUuid = await passRegistration(clientSocket);

  clientSocket.uuid = userUuid;

  console.log("Happy chat!");

  await startChat();
};

clientSocket.on("data", printUserMessage);

clientSocket.connect({ port: PORT }, connection);
