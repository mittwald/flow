import { Plugin } from "vite";
import path from "path";
import * as fs from "fs";
import crypt from "crypto";

const moduleSuffix = ".locale.json";
export const moduleId = `\x00${moduleSuffix}@`;

const localeDirectory = "locales";
const importPathInfosRegEx = new RegExp(
  `^(.+/${localeDirectory})/((.+)${moduleSuffix.replaceAll(".", "\\.")})$`,
);

const generateComponentIntlContent = (
  filePath: string,
  languageKey: string,
): string => {
  const langObject: string[] = [];

  if (languageKey === "*") {
    const fileDirectory = path.dirname(filePath);
    fs.readdirSync(fileDirectory).forEach((file: string) => {
      const filePath = path.join(fileDirectory, file);
      const match = filePath.match(importPathInfosRegEx);

      const fileContent = fs.readFileSync(filePath, "utf8");
      langObject.push(`"${match && match[3]}":${fileContent}`);
    });
  } else {
    const fileContent = fs.readFileSync(filePath, "utf8");
    langObject.push(`"${languageKey}":${fileContent}`);
  }

  return `{${langObject.join(",")}}`;
};

export default {
  name: "handle-i18n-import",
  enforce: "pre",
  handleHotUpdate: async ({ file, server }) => {
    const localeMatch = file.match(importPathInfosRegEx);
    if (localeMatch) {
      const localDirectory = path.dirname(file);
      fs.readdirSync(localDirectory)
        .concat([`*${moduleSuffix}`])
        .forEach((file: string) => {
          const filePath = path.join(localDirectory, file);
          const virtualFileId = crypt
            .createHash("md5")
            .update(filePath)
            .digest("hex");
          const id = `${moduleId}${virtualFileId}`;
          const module = server.moduleGraph.getModuleById(id);
          if (module) {
            server.reloadModule(module);
          }
        });
    }
  },
  async resolveId(id: string, importer: string) {
    const match = id.match(importPathInfosRegEx);
    if (match && importer) {
      const importerDirectory = path.dirname(importer);
      const resolvedTranslationPath = path.resolve(importerDirectory, id);
      const virtualFileId = crypt
        .createHash("md5")
        .update(resolvedTranslationPath)
        .digest("hex");

      return {
        id: moduleId + virtualFileId,
        shouldTransformCachedModule: true,
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
  load(id: string) {
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
} as Plugin;
