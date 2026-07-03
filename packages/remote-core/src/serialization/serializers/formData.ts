import { Serializer } from "@/serialization/Serializer";
import {
  fileDeSerialize,
  fileSerialize,
  isSerializedFile,
} from "@/serialization/serializers";

type SerializedFormDataValue =
  | FormDataEntryValue
  | Awaited<ReturnType<typeof fileSerialize>>;
type SerializedFormDataEntries = [string, SerializedFormDataValue][];

export const formDataSerializer = new Serializer<
  FormData,
  SerializedFormDataEntries
>({
  name: "FormData",
  serialize: {
    isApplicable: (val) => {
      return val instanceof FormData;
    },
    apply: async (formData) => {
      const out: SerializedFormDataEntries = [];

      for (const [fieldName, fieldValue] of formData.entries()) {
        out.push([
          fieldName,
          fieldValue instanceof File
            ? await fileSerialize(fieldValue)
            : fieldValue,
        ]);
      }

      return out;
    },
  },
  deserialize: {
    apply: (array) => {
      const formData = new FormData();

      for (const [name, value] of array) {
        const deserializedValue = isSerializedFile(value)
          ? fileDeSerialize(value)
          : value;

        formData.append(name, deserializedValue);
      }

      return formData;
    },
  },
});
