import { PluginOption } from "vite";
import path from "path";
import * as fs from "fs";

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
  async load(id) {
    if (!id.endsWith("intl/*.json")) {
      return;
    }

    const langFileDir = path.join(id, "..");
    const langObject: string[] = [];
    fs.readdirSync(langFileDir).forEach((file) => {
      const fileContent = fs.readFileSync(path.join(langFileDir, file), {
        encoding: "utf8",
      });
      const cleanKey = file.split("/").pop()?.split(".")[0];
      langObject.push(`"${cleanKey}":${fileContent}`);
    });

    return `{${langObject.join(",")}}`;
  },
  resolveId: (id, source) => {
    if (id === "./intl/*.json" && source) {
      console.log("id", `${path.join(source, "..", id)}`);
      return {
        id: `${path.join(source, "..", id)}`,
        external: "relative",
      };
    }
  },
} as PluginOption;
