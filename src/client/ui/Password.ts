import { password } from "@inquirer/prompts";

export const Password = () =>
  password({
    message: "Enter your Login",
    theme: { prefix: "" },
  });
