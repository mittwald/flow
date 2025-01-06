import { parseAsync } from "yieldable-json";
import VError from "verror";
import { makeError } from "../lib/makeError";
import type { FileContentLoader, FileLoader } from "./types";
import type { ComponentDoc } from "react-docgen-typescript";

export class ComponentFileContentLoader implements FileContentLoader {
  public readonly fileLoader: FileLoader;

  public constructor(fileLoader: FileLoader) {
    this.fileLoader = fileLoader;
  }

  public async load() {
    try {
      const fileContent = await this.fileLoader.loadFile();
      return await this.parseJson(fileContent);
    } catch (error) {
      throw new VError(
        {
          cause: makeError(error),
          name: "ComponentFileContentLoaderError",
        },
        "Failed loading content",
      );
    }
  }

  public async parseJson(json: string): Promise<ComponentDoc[]> {
    return new Promise((res, rej) => {
      return parseAsync(json, (err: Error | null, data: unknown) => {
        if (err) {
          rej(err);
        } else {
          res(data as ComponentDoc[]);
        }
      });
    });
  }
}
