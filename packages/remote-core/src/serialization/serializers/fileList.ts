import { Serializer } from "@/serialization/Serializer";
import {
  fileDeSerialize,
  fileSerialize,
  type SerializedFile,
} from "@/serialization/serializers";

export const fileListSerializer = new Serializer<FileList, SerializedFile[]>({
  name: "FileList",
  serialize: {
    isApplicable: (something): something is FileList =>
      something instanceof FileList,
    apply: async (fileList) =>
      await Promise.all(Array.from(fileList, fileSerialize)),
  },
  deserialize: {
    apply: (arrayFiles) => {
      const dataTransfer = new DataTransfer();
      for (const file of arrayFiles) {
        dataTransfer.items.add(fileDeSerialize(file));
      }
      return dataTransfer.files;
    },
  },
});
