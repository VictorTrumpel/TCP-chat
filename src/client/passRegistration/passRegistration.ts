import { Socket } from "net";
import { Input, Password } from "@client/ui";

const baseRegisterRequest = {
  url: "/register",
  method: "POST",
  headers: {},
  body: {},
};

export const passRegistration = async (socket: Socket) => {
  const login = await Input("Enter your login:");
  const password = await Password("Enter your password:");

  const body = { login, password };
  const request = { ...baseRegisterRequest, body };

  const buffer = Buffer.from(JSON.stringify(request), "utf8");

  socket.write(buffer);

  return waitUserUuidFromServer(socket);
};

export const waitUserUuidFromServer = (socket: Socket): Promise<string> => {
  return new Promise((resolve) => {
    const handleData = (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());
      const uuid = data.body.uuid;
      const isSuccess = data.code === 200;

      if (uuid && isSuccess) {
        resolve(uuid);
        socket.off("data", handleData);
      }
    };

    socket.on("data", handleData);
  });
};
