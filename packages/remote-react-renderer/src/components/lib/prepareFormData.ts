import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const prepareFormData = async (
  formData: FormData,
): Promise<FormData> => {
  for (const [fieldName, value] of formData.entries()) {
    if (value instanceof File) {
      await addAwaitedArrayBuffer(value);

      if (formData.has(fieldName)) {
        formData.append(fieldName, value);
      } else {
        formData.set(fieldName, value);
      }
    }
  }

  return formData;
};
