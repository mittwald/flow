import { parse } from "yaml";
import { fs } from "./fs";

export type TablerIconName = string;

export interface IconDefinition {
  svg: string;
  tb: TablerIconName;
}

export type IconDefinitions = Record<string, IconDefinition>;

export const getIconDefinitions = (file: string): IconDefinitions => {
  const iconMappingYaml = fs.read(file) ?? "";
  return parse(iconMappingYaml);
};
