import { Connection } from "@server/Connection";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { getMessage } from "@server/handlers";
import { Request } from "@shared";
import { userConnectionMapper } from "@server/UserConnectionMapper";

const EXISTED_UUID = "EXISTED_UUID";
const NOT_EXISTED_UUID = "NOT_EXISTED_UUID";
const BASE_USER_LOGIN = "BASE_USER_LOGIN";
const BASE_MESSAGE = "BASE_MESSAGE";

vi.mock("@server/UserConnectionMapper", () => {
  const connection1 = { send: vi.fn() };
  const connection2 = { send: vi.fn() };

  return {
    userConnectionMapper: {
      getUserByUuid: vi.fn((userUuid: string) => {
        if (userUuid === EXISTED_UUID) {
          return { login: BASE_USER_LOGIN };
        }
        if (userUuid === NOT_EXISTED_UUID) {
          return null;
        }
      }),
      getAllConnections: vi.fn(() => [connection1, connection2]),
    },
  };
});

describe("Спецификация функции getMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Функция достает из заголовка запроса uuid пользователя и обращается за пользователем userConnectionMapper", () => {
    const request: Request = {
      url: "",
      method: "POST",
      headers: { uuid: EXISTED_UUID },
      body: { message: "" },
    };

    const connection = {} as unknown as Connection;

    getMessage(request, connection);
  });
  it("Если пользователя в системе с таким uuid не существует, то в коннекшен отправляется респонс с ошибкой и кодом 401", () => {
    const request: Request = {
      url: "",
      method: "POST",
      headers: { uuid: NOT_EXISTED_UUID },
      body: { message: "" },
    };

    const connection = { send: vi.fn() } as unknown as Connection;

    getMessage(request, connection);

    expect(connection.send).toBeCalledTimes(1);

    const sendArg = (connection.send as ReturnType<typeof vi.fn>).mock.calls[0];

    const response = JSON.parse(sendArg.toString());

    expect(response.body.error).toBe("Not Authorized!");
  });
  it("Функция во все соединения отсылает ответы с переданным сообещнием", () => {
    const request: Request = {
      url: "",
      method: "POST",
      headers: { uuid: EXISTED_UUID },
      body: { messageText: BASE_MESSAGE },
    };

    const connection = {} as unknown as Connection;

    getMessage(request, connection);

    expect(userConnectionMapper.getAllConnections).toBeCalledTimes(1);

    const connection1 = userConnectionMapper.getAllConnections()[0];
    const connection2 = userConnectionMapper.getAllConnections()[1];

    expect(connection1.send).toBeCalledTimes(1);
    expect(connection2.send).toBeCalledTimes(1);

    const responseBuffer1 = (connection1.send as ReturnType<typeof vi.fn>).mock
      .calls[0];
    const responseBuffer2 = (connection2.send as ReturnType<typeof vi.fn>).mock
      .calls[0];

    const response1 = JSON.parse(responseBuffer1.toString());
    const response2 = JSON.parse(responseBuffer2.toString());

    expect(response1.code).toBe(200);
    expect(response1.body.login).toBe(BASE_USER_LOGIN);
    expect(response1.body.messageText).toBe(BASE_MESSAGE);
    expect(response1.body.ownerUuid).toBe(EXISTED_UUID);

    expect(response2.code).toBe(200);
    expect(response2.body.login).toBe(BASE_USER_LOGIN);
    expect(response2.body.messageText).toBe(BASE_MESSAGE);
    expect(response2.body.ownerUuid).toBe(EXISTED_UUID);
  });
});
