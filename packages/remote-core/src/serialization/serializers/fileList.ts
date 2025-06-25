import { Serializer } from "@/serialization/Serializer";

export const fileListSerializer = new Serializer<FileList, File[]>({
  name: "FileList",
  serialize: {
    isApplicable: (something) => something instanceof FileList,
    apply: (fileList) => Array.from(fileList),
  },
  deserialize: {
    apply: (arrayFiles) => {
      const dataTransfer = new DataTransfer();
      arrayFiles.forEach((f) => dataTransfer.items.add(f));
      return dataTransfer.files;
    },
  },
});
