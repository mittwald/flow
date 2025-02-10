export const stripImports = (code: string): string =>
  code.replaceAll(/^import [^'"]* from ['"]([^.'"\n ][^'"\n ]*)['"];/gm, "");
