import { ComponentType } from "react";
import PropertiesTableImport from "@/lib/PropertiesTable/PropertiesTable";

declare global {
  declare const LiveCodeEditor: ComponentType<{ example?: string }>;
  declare const PropertiesTable: typeof PropertiesTableImport;
}
