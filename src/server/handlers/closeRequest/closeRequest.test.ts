import { Request } from "@shared";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { Connection } from "@server/Connection";
import { userConnectionMapper } from "@server/UserConnectionMapper";
import { closeRequest } from "./closeRequest";
import { Socket } from "net";

vi.mock("@server/UserConnectionMapper", () => {
  return {
    userConnectionMapper: {
      getConnectionUuid: vi.fn(() => "some-uuid"),
      deleteUserConnectionByUuid: vi.fn(),
    },
  };
});
describe("Спецификация функции closeRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("функция closeRequest вызывает getConnectionUuid у userConnectionMapper что бы получить uuid соединения", () => {
    const request: Request = {
      url: "",
      method: "DELETE",
      headers: {},
      body: {},
    };

    const connection = new Connection(new Socket());

    closeRequest(request, connection);

    expect(userConnectionMapper.getConnectionUuid).toBeCalledTimes(1);
  });

  it(`
    функция closeRequest передает в метод deleteUserConnectionByUuid от userConnectionMapper uuid, полученное
    от getConnectionUuid
  `, () => {
    const request: Request = {
      url: "",
      method: "DELETE",
      headers: {},
      body: {},
    };

    const connection = new Connection(new Socket());

    closeRequest(request, connection);

    expect(userConnectionMapper.deleteUserConnectionByUuid).toBeCalledTimes(1);
    expect(userConnectionMapper.deleteUserConnectionByUuid).toBeCalledWith(
      "some-uuid"
    );
  });
});
