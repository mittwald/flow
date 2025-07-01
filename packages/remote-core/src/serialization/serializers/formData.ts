import { Serializer } from "@/serialization/Serializer";
import {
  fileDeSerialize,
  fileSerialize,
  isSerializedFile,
} from "@/serialization/serializers";

export const formDataSerializer = new Serializer<
  FormData,
  [string, FormDataEntryValue][]
>({
  name: "FormData",
  serialize: {
    isApplicable: (val) => val instanceof FormData,
    apply: (formData) => {
      return formData
        .entries()
        .toArray()
        .map(([fieldName, fieldValue]) => {
          if (fieldValue instanceof File) {
            return [fieldName, fileSerialize(fieldValue)];
          }

          return [fieldName, fieldValue];
        }) as [string, FormDataEntryValue][];
    },
  },
  deserialize: {
    apply: (array) => {
      const formData = new FormData();
      for (const [name, value] of array) {
        const deserializedValue = isSerializedFile(value)
          ? fileDeSerialize(value)
          : value;

        if (!formData.has(name)) {
          formData.set(name, deserializedValue);
        } else {
          formData.append(name, deserializedValue);
        }
      }
      return formData;
    },
  },
});
