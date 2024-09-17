import { input } from "@inquirer/prompts";

export const Input = (placeholder: string) =>
  input({
    message: placeholder,
    required: true,
    theme: { prefix: "" },
  });
