import { password } from "@inquirer/prompts";

export const Password = (placeholder: string) =>
  password({
    message: placeholder,
    theme: { prefix: "" },
  });
