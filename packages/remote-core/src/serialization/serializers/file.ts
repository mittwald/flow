import { TRANSFERABLE } from "@quilted/threads";
import { Serializer } from "@/serialization/Serializer";
import { getAwaitArrayBuffer } from "@mittwald/flow-core";

export interface SerializedFile {
  name: string;
  type: string;
  lastModified: number;
  content: ArrayBuffer;
  [TRANSFERABLE]: number;
}

const serialize = (file: File) => ({
  name: file.name,
  type: file.type,
  lastModified: file.lastModified,
  content: getAwaitArrayBuffer(file),
  [TRANSFERABLE]: 1,
});

const deserialize = (file: SerializedFile) =>
  new File([file.content], file.name, {
    lastModified: file.lastModified,
    type: file.type,
  });

export const fileSerializer = new Serializer<File, SerializedFile>({
  name: "File",
  deserialize: {
    apply: deserialize,
  },
  serialize: {
    isApplicable: (something) => something instanceof File,
    apply: serialize,
  },
});

export const fileListSerializer = new Serializer<FileList, SerializedFile[]>({
  name: "FileList",
  deserialize: {
    apply: (files) => {
      const dataTransfer = new DataTransfer();
      files.map(deserialize).forEach((f) => dataTransfer.items.add(f));
      return dataTransfer.files;
    },
  },
  serialize: {
    isApplicable: (something) => something instanceof FileList,
    apply: (fileList) => Array.from(fileList).map(serialize),
  },
});
