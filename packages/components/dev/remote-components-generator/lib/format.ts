import prettier from "prettier";

export const format = async (ts: string): Promise<string> => {
  return prettier.format(ts, {
    plugins: [],
    parser: "typescript",
  });
};
