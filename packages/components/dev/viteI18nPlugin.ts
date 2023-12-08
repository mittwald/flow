import { Plugin } from "vite";
import path from "path";
import * as fs from "fs";
import type { SourceDescription } from "rollup";

const moduleSuffix = ".locale.json";
const moduleId = `\x00${moduleSuffix}@`;
const localeDirectory = "locales";
const importPathInfosRegEx = new RegExp(
  `^(.+/${localeDirectory})/((.+)${moduleSuffix.replaceAll(".", "\\.")})$`,
);

interface ImportPathInfos {
  directory: string;
  filePath: string;
  fileName: string;
  languageKey: string;
  matches: boolean;
}

const getImportPathInfos = (
  id: string,
  stripModuleId: boolean = false,
): ImportPathInfos => {
  const idToMatch = stripModuleId ? id.replace(moduleId, "") : id;
  const matches = idToMatch.match(importPathInfosRegEx);
  if (matches) {
    return {
      directory: matches[1],
      filePath: idToMatch,
      languageKey: matches[3],
      fileName: matches[2],
      matches: true,
    };
  }

  return {
    directory: "",
    filePath: "",
    languageKey: "",
    fileName: "",
    matches: false,
  };
};

const generateComponentIntlContent = (
  importPathInfos: ImportPathInfos,
): string => {
  const langObject: string[] = [];
  const { languageKey, filePath, directory } = importPathInfos;

  if (languageKey === "*") {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const { languageKey } = getImportPathInfos(filePath);

      const fileContent = fs.readFileSync(filePath, "utf8");
      langObject.push(`"${languageKey}":${fileContent}`);
    });
  } else {
    const fileContent = fs.readFileSync(filePath, "utf8");
    langObject.push(`"${languageKey}":${fileContent}`);
  }

  return `{${langObject.join(",")}}`;
};

const generateSourceResponse = (id: string): SourceDescription | undefined => {
  const pathInfo = getImportPathInfos(id, true);

  if (pathInfo.matches) {
    return {
      code: generateComponentIntlContent(pathInfo),
      map: null,
    };
  }
};

export default {
  name: "handle-i18n-import",
  enforce: "pre",
  handleHotUpdate: async ({ file, server }) => {
    const { matches, filePath, directory } = getImportPathInfos(file);

    if (matches) {
      [
        moduleId + path.join(directory, `*${moduleSuffix}`),
        moduleId + filePath,
      ].forEach((id) => {
        const module = server.moduleGraph.getModuleById(id);
        if (module) {
          server.moduleGraph.invalidateModule(module);
        }
      });

      server.ws.send({
        type: "full-reload",
      });
    }
  },
  transform: (_, id) => generateSourceResponse(id),
  load: (id) => generateSourceResponse(id),
  resolveId: (id, source) => {
    const { matches, filePath } = getImportPathInfos(id);

    if (matches && source) {
      return {
        id: `${moduleId}${path.resolve(path.dirname(source), filePath)}`,
      };
    }
  },
} as Plugin;
