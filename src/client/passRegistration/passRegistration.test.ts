import { describe, it, vi, expect } from "vitest";
import { passRegistration, waitUserUuidFromServer } from "./passRegistration";
import { Socket } from "net";

vi.mock("@client/ui", () => {
  return {
    Input: () => Promise.resolve("LOGIN"),
    Password: () => Promise.resolve("PASSWORD"),
  };
});

describe("Спецификация функции passRegistration", () => {
  it("Функция отправляет в сокет запрос с url /register, а так же с логином и паролем пользователя", async () => {
    const socket = {
      write: vi.fn(),
      on: vi.fn((_: string, cb: (buffer: Buffer) => void) => {
        cb(
          Buffer.from(
            JSON.stringify({ code: 200, body: { uuid: "TEST_UUID" } })
          )
        );
      }),
      off: vi.fn(),
    } as unknown as Socket;

    await passRegistration(socket);

    expect(socket.write).toBeCalledTimes(1);

    const calledBuffer = (socket.write as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as Buffer;

    const payload = JSON.parse(calledBuffer.toString());

    expect(payload.url).toBe("/register");
    expect(payload.body.login).toBe("LOGIN");
    expect(payload.body.password).toBe("PASSWORD");
  });

  it("Функция возвращает uuid зарегистрированного пользователя", async () => {
    const socket = {
      write: vi.fn(),
      on: vi.fn((_: string, cb: (buffer: Buffer) => void) => {
        cb(
          Buffer.from(
            JSON.stringify({ code: 200, body: { uuid: "TEST_UUID" } })
          )
        );
      }),
      off: vi.fn(),
    } as unknown as Socket;

    const userUuid = await passRegistration(socket);

    expect(userUuid).toBe("TEST_UUID");
  });
});

describe("Спецификация функции waitUserUuidFromServer", () => {
  it("Функция возвращает uuid полученного пользователя", async () => {
    const socket = {
      write: vi.fn(),
      on: vi.fn((_: string, cb: (buffer: Buffer) => void) => {
        cb(
          Buffer.from(
            JSON.stringify({ code: 200, body: { uuid: "TEST_UUID" } })
          )
        );
      }),
      off: vi.fn(),
    } as unknown as Socket;

    const userUuid = await waitUserUuidFromServer(socket);

    expect(userUuid).toBe("TEST_UUID");
  });
  it("Функция подписывается на ответ сокета, а потом снимает отписку", async () => {
    const socket = {
      write: vi.fn(),
      on: vi.fn((_: string, cb: (buffer: Buffer) => void) => {
        cb(
          Buffer.from(
            JSON.stringify({ code: 200, body: { uuid: "TEST_UUID" } })
          )
        );
      }),
      off: vi.fn(),
    } as unknown as Socket;

    await waitUserUuidFromServer(socket);

    expect(socket.on).toBeCalledTimes(1);

    // хендлер, который был передан в socket.on, который потом нужно удалить
    const onPassedHandler = (socket.on as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    expect(socket.off).toBeCalledTimes(1);
    expect(socket.off).toBeCalledWith("data", onPassedHandler);
  });
});
