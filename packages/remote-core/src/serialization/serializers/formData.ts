import { Serializer } from "@/serialization/Serializer";

type FormDataEntry = [string, unknown];
type FormDataEntries = FormDataEntry[];

export const formDataSerializer = new Serializer<FormData, FormDataEntries>({
  name: "FormData",
  serialize: {
    isApplicable: (val) => val instanceof FormData,
    apply: (formData) => {
      return formData.entries().toArray();
    },
  },
  deserialize: {
    apply: (array) => {
      const formData = new FormData();
      for (const [name, value] of array) {
        if (!formData.has(name)) {
          formData.set(name, value as never);
        } else {
          formData.append(name, value as never);
        }
      }
      return formData;
    },
  },
});
