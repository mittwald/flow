import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const prepareFormData = async (
  formData: FormData,
): Promise<FormData> => {
  const fieldNames = [...new Set(Array.from(formData.keys()))];

  for (const fieldName of fieldNames) {
    const values = formData.getAll(fieldName);
    formData.delete(fieldName);

    for (const value of values) {
      if (value instanceof File) {
        await addAwaitedArrayBuffer(value);
      }
      formData.append(fieldName, value);
    }
  }

  return formData;
};
