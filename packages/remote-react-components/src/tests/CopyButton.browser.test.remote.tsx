import { CopyButton, Div, TextField } from "@/auto-generated";

export const standard = () => (
  <CopyButton data-testid="button" text="copy-me" />
);

export const eventhandler = () => {
  return (
    <Div>
      <TextField name="input" aria-label="Input" />
      <CopyButton data-testid="button" text="copy-me" />
    </Div>
  );
};
