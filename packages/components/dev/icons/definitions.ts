import { parse } from "yaml";
import { fs } from "./fs";

export type TablerIconName = string;

export interface CustomSvgIconDefinition {
  svg: string;
}

export type IconDefinition = TablerIconName | CustomSvgIconDefinition;

export type IconDefinitions = Record<string, IconDefinition>;

export const getIconDefinitions = (file: string): IconDefinitions => {
  const iconMappingYaml = fs.read(file) ?? "";
  return parse(iconMappingYaml);
};
