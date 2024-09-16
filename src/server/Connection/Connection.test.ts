import { describe, it, vi, expect } from "vitest";
import { Socket } from "net";
import { Request } from "@shared";
import { Connection } from "./Connection";

vi.mock("net", async (importModule) => {
  const module: Record<string, unknown> = await importModule();

  class MockSocket {
    callback = new Set<(buffer: Buffer) => void>();

    on(_: string, cb: () => void) {
      this.callback.add(cb);
    }

    emitMock(buffer: Buffer) {
      [...this.callback].forEach((cb) => cb(buffer));
    }

    write = vi.fn();
  }

  return {
    ...module,
    Socket: MockSocket,
  };
});

describe("Спецификация компонента Connection", () => {
  it(`Если повесить коллбэк на определенный роут, а потом в сокет прилетит запрос по этому роуту, то колбэк вызовется`, () => {
    const socket = new Socket();

    const connection = new Connection(socket);

    const cb = vi.fn();

    connection.on("/request", cb);

    const request: Request = {
      url: "/request",
      method: "POST",
      headers: {},
      body: {},
    };

    // создаем и инициируем запрос
    const buffer = Buffer.from(JSON.stringify(request), "utf8");
    // @ts-ignore
    socket.emitMock(buffer as unknown as string);

    expect(cb).toBeCalledTimes(1);
  });
  it("Когда кол-бэк, повешенный на запрос вызывается, то ему передаются все параметры из запроса", () => {
    const socket = new Socket();

    const connection = new Connection(socket);

    const cb = vi.fn();

    connection.on("/request", cb);

    const request: Request = {
      url: "/request",
      method: "POST",
      headers: {},
      body: {},
    };

    // создаем и инициируем запрос
    const buffer = Buffer.from(JSON.stringify(request), "utf8");
    // @ts-ignore
    socket.emitMock(buffer as unknown as string);

    const requestInArgs = cb.mock.calls[0][0];

    expect(requestInArgs.url).toBe(request.url);
    expect(requestInArgs.method).toBe(request.method);
    expect(JSON.stringify(requestInArgs.headers)).toBe(
      JSON.stringify(request.headers)
    );
    expect(JSON.stringify(requestInArgs.body)).toBe(
      JSON.stringify(request.body)
    );
  });
  it("Если приходит запрос на эндпойнт к которому нет кол-бэка, то ничего не происходит, ошибки нет", () => {
    const socket = new Socket();

    const connection = new Connection(socket);

    connection.on("", () => {});

    const request: Request = {
      url: "/request",
      method: "POST",
      headers: {},
      body: {},
    };

    // создаем и инициируем запрос
    const buffer = Buffer.from(JSON.stringify(request), "utf8");
    // @ts-ignore
    socket.emitMock(buffer);

    // ничего не падает, ошибок не происходит
  });

  it("Метод write отправляет буффер по сокету", () => {
    const socket = new Socket();

    const connection = new Connection(socket);

    const buffer = Buffer.from(JSON.stringify({}), "utf8");

    connection.send(buffer);

    expect(socket.write).toBeCalledTimes(1);
    expect(socket.write).toBeCalledWith(buffer);
  });
});
