import { getRequestFromBuffer } from "./getRequestFromBuffer";
import { Request } from "../Request";
import { describe, it, expect } from "vitest";

describe("Спецификация компонента getRequestFromBuffer", () => {
  it("Если в функцию передать валидный буффер с реквестом, то функция распарсит буффер и вернет запрос", () => {
    const clientRequest: Request = {
      url: "/auth",
      method: "GET",
      headers: { token: "123" },
      body: { name: "John" },
    };

    const requestStr = JSON.stringify(clientRequest);

    const requestBuffer = Buffer.from(requestStr, "utf8");

    const request = getRequestFromBuffer(requestBuffer);

    expect(request?.url).toBe(clientRequest.url);
    expect(request?.method).toBe(clientRequest.method);
    expect(request?.headers?.token).toBe(clientRequest.headers.token);
    expect(request?.body.name).toBe(clientRequest.body.name);
  });
  it("Если в буффер положили любой не валидный json то возвращается null", () => {
    const clientRequest = "not valid json";
    const requestBuffer = Buffer.from(clientRequest, "utf8");
    const request = getRequestFromBuffer(requestBuffer);
    expect(request).toBe(null);
  });
  it("Если в запросе нет поля url, то возвращается null", () => {
    const clientRequest = {
      method: "GET",
      headers: { token: "123" },
      body: { name: "John" },
    };

    const requestStr = JSON.stringify(clientRequest);

    const requestBuffer = Buffer.from(requestStr, "utf8");

    const request = getRequestFromBuffer(requestBuffer);

    expect(request).toBeNull();
  });
  it("Если в запросе нет поля method, то возвращается null", () => {
    const clientRequest = {
      url: "/auth",
      headers: { token: "123" },
      body: { name: "John" },
    };
    const requestStr = JSON.stringify(clientRequest);

    const requestBuffer = Buffer.from(requestStr, "utf8");

    const request = getRequestFromBuffer(requestBuffer);

    expect(request).toBeNull();
  });
  it("Если в запросе нет поля headers, то возвращается null", () => {
    const clientRequest = {
      url: "/auth",
      method: "GET",
      body: { name: "John" },
    };
    const requestStr = JSON.stringify(clientRequest);
    const requestBuffer = Buffer.from(requestStr, "utf8");
    const request = getRequestFromBuffer(requestBuffer);
    expect(request).toBeNull();
  });
  it("Если в запросе поле headers не инстанс функции Object", () => {
    const clientRequest = {
      url: "/auth",
      method: "GET",
      headers: "not valid",
      body: { name: "John" },
    };
    const requestStr = JSON.stringify(clientRequest);
    const requestBuffer = Buffer.from(requestStr, "utf8");
    const request = getRequestFromBuffer(requestBuffer);
    expect(request).toBeNull();
  });
  it("Если в запросе нет поля body, то возвращается null", () => {
    const clientRequest = {
      url: "/auth",
      method: "GET",
      headers: {},
    };
    const requestStr = JSON.stringify(clientRequest);
    const requestBuffer = Buffer.from(requestStr, "utf8");
    const request = getRequestFromBuffer(requestBuffer);
    expect(request).toBeNull();
  });
  it("Если поле body не инстанс объекта, то возвращается null", () => {
    const clientRequest = {
      url: "/auth",
      method: "GET",
      headers: {},
      body: "not valid",
    };
    const requestStr = JSON.stringify(clientRequest);
    const requestBuffer = Buffer.from(requestStr, "utf8");
    const request = getRequestFromBuffer(requestBuffer);
    expect(request).toBeNull();
  });
});
