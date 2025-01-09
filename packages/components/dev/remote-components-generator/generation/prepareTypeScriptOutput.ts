import { format } from "../lib/format";

const header = `\
/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
`;

export const prepareTypeScriptOutput = async (
  content: string,
): Promise<string> => {
  const formatted = await format(content);
  return header + formatted;
};
