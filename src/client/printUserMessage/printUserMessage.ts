import { Response } from "@shared";
import { clientSocket } from "../Socket";

export const printUserMessage = (buffer: Buffer) => {
  const response: Response = JSON.parse(buffer.toString());

  const isSuccess = response.code === 200;
  const isMessageText = response.body.messageText;

  if (!isSuccess || !isMessageText) return;

  const userLogin = response.body.login;
  const messageText = response.body.messageText;
  const ownerUuid = response.body.ownerUuid;

  const isItMyMessage = clientSocket.uuid === ownerUuid;

  if (isItMyMessage) {
    printMyMessage(messageText);
    return;
  }

  printMessage(userLogin, messageText);
};

const printMessage = (login: string, message: string) =>
  console.log(`\x1b[1m${login}:\x1b[0m ${message}`);

const printMyMessage = (message: string) =>
  console.log(`\x1b[34m\x1b[1mYou:\x1b[0m\x1b[0m ${message}`);
