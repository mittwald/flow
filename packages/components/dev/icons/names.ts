import { parse } from "yaml";
import { fs } from "./fs";

export type IconNames = string[];

export const getIconNames = (file: string): IconNames => {
  const iconMappingYaml = fs.read(file) ?? "";
  return Object.keys(parse(iconMappingYaml));
};
