import { describe, it, vi, beforeEach, expect } from "vitest";
import { userConnectionMapper } from "@server/UserConnectionMapper";
import { Connection } from "@server/Connection";
import { Request } from "@shared";
import { registerRequest } from "./registerRequest";

vi.mock("@server/UserConnectionMapper", () => {
  return {
    userConnectionMapper: {
      addUserConnection: vi.fn(() => "some-uuid"),
    },
  };
});

describe("Спецификация на функцию registerRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Функция передает в userConnectionMapper полученного пользователя и соединение", () => {
    const user = { login: "John", password: "123" };

    const request: Request = {
      url: "",
      method: "POST",
      body: user,
      headers: {},
    };

    const connection = { send: vi.fn() } as unknown as Connection;

    registerRequest(request, connection);

    expect(userConnectionMapper.addUserConnection).toBeCalledTimes(1);
    expect(userConnectionMapper.addUserConnection).toBeCalledWith(
      user,
      connection
    );
  });

  it('Функция посылает в сокет ответ вида: { uuid: "some-uuid" }', () => {
    const user = { login: "John", password: "123" };

    const request: Request = {
      url: "",
      method: "POST",
      body: user,
      headers: {},
    };

    const connection = { send: vi.fn() } as unknown as Connection;

    registerRequest(request, connection);

    expect(connection.send).toBeCalledTimes(1);

    const arg = (connection.send as ReturnType<typeof vi.fn>).mock.calls[0][0];

    const responseJson = JSON.parse((arg as Buffer).toString());

    expect(responseJson.body.uuid).toBe("some-uuid");
    expect(responseJson.code).toBe(200);
  });
});
