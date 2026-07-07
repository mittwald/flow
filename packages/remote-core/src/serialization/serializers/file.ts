import { markAsTransferable } from "@quilted/threads";
import { Serializer } from "@/serialization/Serializer";

export interface SerializedFile {
  name: string;
  type: string;
  lastModified: number;
  content: ArrayBuffer;
}

export const isSerializedFile = (value: unknown): value is SerializedFile => {
  return !!(
    value &&
    typeof value === "object" &&
    "name" in value &&
    "type" in value &&
    "lastModified" in value &&
    "content" in value
  );
};

export const fileSerialize = async (file: File): Promise<SerializedFile> => {
  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    content: markAsTransferable(await file.arrayBuffer()),
  };
};

export const fileDeSerialize = (file: SerializedFile) => {
  return new File([file.content], file.name, {
    lastModified: file.lastModified,
    type: file.type,
  });
};

export const fileSerializer = new Serializer<File, SerializedFile>({
  name: "File",
  serialize: {
    isApplicable: (something) => something instanceof File,
    apply: fileSerialize,
  },
  deserialize: {
    apply: fileDeSerialize,
  },
});
