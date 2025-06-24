import { markAsTransferable } from "@quilted/threads";
import { Serializer } from "@/serialization/Serializer";
import { getAwaitArrayBuffer } from "@mittwald/flow-core";

export interface SerializedFile {
  name: string;
  type: string;
  lastModified: number;
  content: ArrayBuffer;
}

export const fileSerializer = new Serializer<File, SerializedFile>({
  name: "File",
  serialize: {
    isApplicable: (something) => something instanceof File,
    apply: (file: File) => {
      return {
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        content: markAsTransferable(getAwaitArrayBuffer(file)),
      };
    },
  },
  deserialize: {
    apply: (file: SerializedFile) => {
      return new File([file.content], file.name, {
        lastModified: file.lastModified,
        type: file.type,
      });
    },
  },
});
