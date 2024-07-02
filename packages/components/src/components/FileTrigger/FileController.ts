import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useRef } from "react";
import type * as Aria from "react-aria-components";
import type { DropEvent } from "@react-types/shared";

export class FileController {
  public readonly files = new Map<number, File>();
  private id = 0;

  public constructor() {
    makeObservable(this, {
      files: observable.shallow,
      add: action.bound,
      clear: action.bound,
      dropFile: action.bound,
      selectFile: action.bound,
    });
  }

  public static useNew(): FileController {
    return useRef(new FileController()).current;
  }

  public useFiles(): File[] {
    return useSelector(() => Array.from(this.files.values()));
  }

  public add(file: File): void {
    const id = this.id++;

    this.files.set(id, file);
  }

  public clear(): void {
    this.files.clear();
  }

  public async dropFile(
    e: DropEvent,
    acceptedFileTypes?: string[],
    allowsMultiple?: boolean,
  ) {
    const fileDropItems = e.items.filter(
      (file) => file.kind === "file",
    ) as Aria.FileDropItem[];

    fileDropItems.map(async (f, i) => {
      const file = await f.getFile();

      if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
        alert(`files of this type are not allowed`);
        return;
      }

      if (!allowsMultiple && i > 0) {
        alert(`multiple files are not allowed`);
        return;
      }

      if (!allowsMultiple) {
        this.clear();
      }

      this.add(file);
    });
  }

  public selectFile(e: FileList | null, allowsMultiple?: boolean) {
    const files = e ? Array.from(e) : [];
    files.map((f) => {
      if (!allowsMultiple) {
        this.clear();
      }
      this.add(f);
    });
  }
}

export default FileController;
