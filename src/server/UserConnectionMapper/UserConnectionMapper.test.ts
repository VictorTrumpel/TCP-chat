import { Socket } from "net";
import { describe, it, expect } from "vitest";
import { User } from "@shared";
import { UserConnectionMapper } from "./UserConnectionMapper";
import { Connection } from "../Connection";

describe("Спецификация класса UserConnectionMapper", () => {
  it("Метод addUserConnection добавляет пользователя в хранилище uuidUserMap и возвращает его uuid", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const userUuid = userConnectionMapper.addUserConnection(user, connection);

    // @ts-ignore
    const uuidUserMap = userConnectionMapper.uuidUserMap;

    expect(uuidUserMap.has(userUuid)).toBeTruthy();

    const connectedUser = uuidUserMap.get(userUuid);

    expect(connectedUser?.login).toBe(user.login);
    expect(connectedUser?.password).toBe(user.password);
  });

  it("Метод addUserConnection добавляет соединение в uuidConnectionMap", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const userUuid = userConnectionMapper.addUserConnection(user, connection);

    // @ts-ignore
    const uuidConnectionMap = userConnectionMapper.uuidConnectionMap;

    expect(uuidConnectionMap.has(userUuid)).toBeTruthy();
    expect(uuidConnectionMap.get(userUuid)).toBe(connection);
  });

  it("Метод getUserByUuid возвращает пользователя по переданному uuid", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const userUuid = userConnectionMapper.addUserConnection(user, connection);

    const connectedUser = userConnectionMapper.getUserByUuid(userUuid);

    expect(connectedUser).toBe(user);
  });

  it("Метод getUserByUuid возвращает null, если пользователя по переданному uuid не существует", () => {
    const userConnectionMapper = new UserConnectionMapper();

    const connectedUser = userConnectionMapper.getUserByUuid("nothing");

    expect(connectedUser).toBe(null);
  });

  it("Метод getConnectionByUuid возвращает соединение, по переданному uuid", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const userUuid = userConnectionMapper.addUserConnection(user, connection);

    const connectedConnection =
      userConnectionMapper.getConnectionByUuid(userUuid);

    expect(connectedConnection).toBe(connection);
  });

  it("Метод getConnectionByUuid возвращает null, по переданному uuid, если соединения не существует", () => {
    const userConnectionMapper = new UserConnectionMapper();

    const connectedConnection =
      userConnectionMapper.getConnectionByUuid("nothing");

    expect(connectedConnection).toBe(null);
  });
});
