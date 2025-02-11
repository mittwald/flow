import * as prettier from "prettier";

const getPrettierOptions = async (): Promise<prettier.Options> => {
  const prettierConfig = await prettier
    .resolveConfig(import.meta.dirname, { useCache: true })
    .then((c) => c ?? {});

  return {
    ...prettierConfig,
    parser: "typescript",
  };
};

const header = `\
  /* auto-generated file */
`;

export const prettify = async (content: string): Promise<string> =>
  prettier.format(header + content, await getPrettierOptions());
