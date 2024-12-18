import jetpack from "fs-jetpack";
import VError from "verror";
import { makeError } from "../lib/makeError";
import type { FileLoader } from "./types";

export class ComponentFileLoader implements FileLoader {
  public async loadFile(): Promise<string> {
    try {
      const file = await jetpack.readAsync(
        "./packages/components/out/doc-properties.json",
      );
      if (file === undefined || file === "") {
        throw new Error(`doc-properties.json file not found`);
      }
      return file;
    } catch (error) {
      throw new VError(
        {
          cause: makeError(error),
          name: "ComponentFileLoaderError",
        },
        "File loading failed",
      );
    }
  }
}
