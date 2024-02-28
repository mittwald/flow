import { parse } from "yaml";
import { fs } from "./fs";

export const getIconMappings = (file: string): Record<string, string> => {
  const iconMappingYaml = fs.read(file) ?? "";
  return parse(iconMappingYaml);
};
