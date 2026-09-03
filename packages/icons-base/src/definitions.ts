import { parse } from "yaml";
import { fs } from "./fs";

export type VendorIconName = string;

export type IconVendor = "tb" | "fa";

export type IconCategory = "functional" | "decorative" | "status";

export type IconDefinition = {
  svg?: string;
  category?: IconCategory;
  deprecated?: boolean;
} & Partial<Record<IconVendor, VendorIconName>>;

export type IconDefinitions = Record<string, IconDefinition>;

export const getIconDefinitions = (file: string): IconDefinitions => {
  const iconMappingYaml = fs.read(file) ?? "";
  return parse(iconMappingYaml);
};
