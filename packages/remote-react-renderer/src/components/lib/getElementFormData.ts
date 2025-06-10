import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const getElementFormData = async (
  formData: FormData,
): Promise<FormData> => {
  for (const value of formData.values()) {
    if (value instanceof File) {
      await addAwaitedArrayBuffer(value);
    }
  }

  return formData;
};
