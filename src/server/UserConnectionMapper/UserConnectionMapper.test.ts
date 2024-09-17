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

  it("Метод getConnectionUuid возвращает uuid соединения в системе", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const createdUuid = userConnectionMapper.addUserConnection(
      user,
      connection
    );

    const connectionUuid = userConnectionMapper.getConnectionUuid(connection);

    expect(connectionUuid).toBe(createdUuid);
  });

  it("Метод getConnectionUuid возвращает null, если переданного соединения нет в системе", () => {
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const connectionUuid = userConnectionMapper.getConnectionUuid(connection);

    expect(connectionUuid).toBe(null);
  });

  it("Метод deleteUserConnectionByUuid удаляет из хранилища uuidUserMap пользователя и соединение из uuidConnectionMap", () => {
    const user: User = { login: "John", password: "123" };
    const connection = new Connection(new Socket());
    const userConnectionMapper = new UserConnectionMapper();

    const createdUuid = userConnectionMapper.addUserConnection(
      user,
      connection
    );

    userConnectionMapper.deleteUserConnectionByUuid(createdUuid);

    // @ts-ignore
    const uuidUserMap = userConnectionMapper.uuidUserMap;
    // @ts-ignore
    const uuidConnectionMap = userConnectionMapper.uuidConnectionMap;

    expect(uuidConnectionMap.has(createdUuid)).toBeFalsy();
    expect(uuidUserMap.has(createdUuid)).toBeFalsy();
  });

  it("Метод getAllConnections возвращает все текущие соединения в виде массива", () => {
    const user1: User = { login: "John", password: "123" };
    const connection1 = new Connection(new Socket());

    const user2: User = { login: "Petr", password: "456" };
    const connection2 = new Connection(new Socket());

    const userConnectionMapper = new UserConnectionMapper();

    userConnectionMapper.addUserConnection(user1, connection1);
    userConnectionMapper.addUserConnection(user2, connection2);

    const allConnections = userConnectionMapper.getAllConnections();

    const expectedConnections = [
      // @ts-ignore
      ...userConnectionMapper.uuidConnectionMap.values(),
    ];

    for (let i = 0; i < expectedConnections.length; i++) {
      const expectedConnection = expectedConnections[i];
      const connection = allConnections[i];

      const isTheSame = expectedConnection === connection;

      expect(isTheSame).toBeTruthy();
    }
  });
});
