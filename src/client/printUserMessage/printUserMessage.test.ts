import { Response } from "@shared";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { printUserMessage } from "./printUserMessage";

const BASE_SOCKET_UUID = "BASE_SOCKET_UUID";

vi.mock("../Socket", () => {
  return { clientSocket: { uuid: "BASE_SOCKET_UUID" } };
});

console.log = vi.fn();

describe("Спецификация функции printUserMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Если респонс имеет не код 200, ничего не выводится", () => {
    const response: Response = {
      code: 400,
      body: {},
    };

    printUserMessage(Buffer.from(JSON.stringify(response)));

    expect(console.log).toBeCalledTimes(0);
  });
  it("Если сообщение пустое, то ничего не выводится", () => {
    const response: Response = {
      code: 200,
      body: {
        message: "",
      },
    };

    printUserMessage(Buffer.from(JSON.stringify(response)));

    expect(console.log).toBeCalledTimes(0);
  });

  it("Если сообщение пустое, то ничего не выводится", () => {
    const response: Response = {
      code: 200,
      body: {
        message: "",
      },
    };

    printUserMessage(Buffer.from(JSON.stringify(response)));

    expect(console.log).toBeCalledTimes(0);
  });

  it("Если сообщение пришло от меня же самого, то оно выводится с плашкой You: и подсвечено синим и выделено жирным", () => {
    const response: Response = {
      code: 200,
      body: {
        messageText: "Message",
        ownerUuid: BASE_SOCKET_UUID,
      },
    };

    printUserMessage(Buffer.from(JSON.stringify(response)));

    expect(console.log).toBeCalledTimes(1);

    const printMessage = (console.log as ReturnType<typeof vi.fn>).mock
      .calls[0][0];

    expect(printMessage).toBe("\x1b[34m\x1b[1mYou:\x1b[0m\x1b[0m Message");
  });
  it("Если сообщение пришло от другого пользователя, то выводится его ник и сообщение, ник выделен жирным", () => {
    const response: Response = {
      code: 200,
      body: {
        login: "USER",
        messageText: "Message",
        ownerUuid: "",
      },
    };

    printUserMessage(Buffer.from(JSON.stringify(response)));

    expect(console.log).toBeCalledTimes(1);

    const printMessage = (console.log as ReturnType<typeof vi.fn>).mock
      .calls[0][0];

    expect(printMessage).toBe("\x1b[1mUSER:\x1b[0m Message");
  });
});
