import { Serializer } from "@/serialization/Serializer";
import {
  fileDeSerialize,
  fileSerialize,
  type SerializedFile,
} from "@/serialization/serializers";

export const fileListSerializer = new Serializer<FileList, SerializedFile[]>({
  name: "FileList",
  serialize: {
    isApplicable: (something) => {
      return something instanceof FileList;
    },
    apply: (fileList) => Array.from(fileList).map(fileSerialize),
  },
  deserialize: {
    apply: (arrayFiles) => {
      const dataTransfer = new DataTransfer();
      arrayFiles.forEach((f) => dataTransfer.items.add(fileDeSerialize(f)));
      return dataTransfer.files;
    },
  },
});
