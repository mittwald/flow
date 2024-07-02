import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useRef } from "react";

export class FileController {
  public readonly files = new Map<number, File>();
  private id = 0;

  public constructor() {
    makeObservable(this, {
      files: observable.shallow,
      add: action.bound,
      remove: action.bound,
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

  public remove(id: number): void {
    this.files.delete(id);
  }
}

export default FileController;
