import type { ComponentDoc } from "react-docgen-typescript";

export interface FileLoader {
  loadFile(): Promise<string>;
}

export interface FileContentLoader {
  parseJson(json: string): Promise<ComponentDoc[]>;
}
