import { Plugin } from "vite";
import path from "path";
import * as fs from "fs";

const generateComponentIntlContent = (directory: string): string => {
  const langFileDir = path.join(directory, "..");
  const langObject: string[] = [];
  fs.readdirSync(langFileDir).forEach((file) => {
    const fileContent = fs.readFileSync(path.join(langFileDir, file), {
      encoding: "utf8",
    });
    const cleanKey = file.split("/").pop()?.split(".")[0];
    langObject.push(`"${cleanKey}":${fileContent}`);
  });

  return `{${langObject.join(",")}}`;
};

export default {
  name: "handle-i18n-import",
  enforce: "pre",
  handleHotUpdate: async ({ file, server }) => {
    if (file.includes("/intl/")) {
      const moduleId = path.join(file, "..", "*.json");
      const virtualModule = server.moduleGraph.getModuleById(moduleId)!;
      server.moduleGraph.invalidateModule(virtualModule);
      server.ws.send({
        type: "full-reload",
      });
    }
  },
  transform: (id) => {
    if (!id.endsWith("intl/*.json")) {
      return;
    }

    return {
      code: generateComponentIntlContent(id),
      map: null,
    };
  },
  load: (id) => {
    if (!id.endsWith("intl/*.json")) {
      return;
    }

    return generateComponentIntlContent(id);
  },
  resolveId: (id, source) => {
    if (id === "./intl/*.json" && source) {
      return {
        id: `${path.join(source, "..", id)}`,
      };
    }
  },
} as Plugin;
