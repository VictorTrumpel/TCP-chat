import { input } from "@inquirer/prompts";

export const Input = () =>
  input({
    message: "Enter your Login",
    required: true,
    theme: { prefix: "" },
  });
