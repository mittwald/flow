import type { Plugin } from "vite";
import path from "path";
import { readdirSync, readFileSync } from "fs";
import crypt from "crypto";
import { compileStrings } from "@internationalized/string-compiler";

export const moduleSuffix = ".locale.json";
export const moduleId = `\x00${moduleSuffix}@`;

const localeDirectory = "locales";
const importPathInfosRegEx = new RegExp(
  `^(.+/${localeDirectory})/((.+)${moduleSuffix.replaceAll(".", "\\.")})$`,
);

export const generateVirtualFileId = (filePath: string): string => {
  const virtualFileId = crypt
    .createHash("md5")
    .update(path.resolve(filePath))
    .digest("hex");
  return `${moduleId}${virtualFileId}`;
};

const compileLocalString = (localesString: string): string => {
  return (
    compileStrings(JSON.parse(localesString))
      // we create our own virtual file, so we
      // don't need the export from compileStrings
      .replace("module.exports =", "")
  );
};

const generateComponentIntlContent = (
  filePath: string,
  languageKey: string,
): string => {
  const langObject: string[] = [];

  if (languageKey === "*") {
    const fileDirectory = path.dirname(filePath);
    readdirSync(fileDirectory).forEach((file: string) => {
      const filePath = path.join(fileDirectory, file);
      const match = filePath.match(importPathInfosRegEx);

      const fileContent = readFileSync(filePath, "utf8");
      langObject.push(
        `"${match && match[3]}":${compileLocalString(fileContent)}`,
      );
    });
  } else {
    const fileContent = readFileSync(filePath, "utf8");
    langObject.push(`"${languageKey}":${compileLocalString(fileContent)}`);
  }

  return `{${langObject.join(",")}}`;
};

export const viteI18nPlugin: Plugin = {
  name: "handle-i18n-import",
  enforce: "pre",
  handleHotUpdate: async ({ file, server }) => {
    const localeMatch = file.match(importPathInfosRegEx);
    if (localeMatch) {
      const localDirectory = path.dirname(file);
      readdirSync(localDirectory)
        .concat([`*${moduleSuffix}`])
        .forEach((file: string) => {
          const filePath = path.join(localDirectory, file);
          const module = server.moduleGraph.getModuleById(
            generateVirtualFileId(filePath),
          );
          if (module) {
            server.reloadModule(module);
          }
        });
    }
  },
  async resolveId(id, importer) {
    const match = id.match(importPathInfosRegEx);
    if (match && importer) {
      const importerDirectory = path.dirname(importer);
      const resolvedTranslationPath = path.resolve(importerDirectory, id);

      return {
        id: generateVirtualFileId(resolvedTranslationPath),
        meta: {
          id,
          importer,
          importerDirectory,
          resolvedTranslationPath,
          requestedLanguageKey: match[3],
        },
      };
    }
  },
  load(id) {
    if (id.startsWith(moduleId)) {
      const virtualFileModule = this.getModuleInfo(id);

      if (virtualFileModule && virtualFileModule.meta) {
        const meta = virtualFileModule.meta;
        const code = generateComponentIntlContent(
          meta.resolvedTranslationPath,
          meta.requestedLanguageKey,
        );

        return {
          code: `export default ${code};`,
          map: null,
        };
      }
    }
  },
};
