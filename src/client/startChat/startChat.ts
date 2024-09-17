import { Input } from "@client/ui";
import { Request } from "@shared";
import { clientSocket } from "../Socket";

export const startChat = async () => {
  if (!clientSocket.uuid) return;

  while (true) {
    const myMessageGap = "        ";

    const messageText = await Input(myMessageGap);

    process.stdout.write("\x1b[1A"); // Поднимаемся на одну строку вверх
    process.stdout.write("\x1b[2K"); // Очищаем строку

    const request: Request = {
      url: "/message",
      method: "POST",
      headers: { uuid: clientSocket.uuid },
      body: { messageText },
    };

    const requestBuffer = Buffer.from(JSON.stringify(request));

    clientSocket.write(requestBuffer);
  }
};
