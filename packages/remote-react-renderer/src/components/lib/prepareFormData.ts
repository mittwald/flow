import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const prepareFormData = async (
  formData: FormData,
): Promise<FormData> => {
  for (const [fieldName] of formData) {
    const fieldValues = formData.getAll(fieldName);

    if (fieldValues.every((v) => v instanceof File)) {
      formData.delete(fieldName);
    }

    for (let value of fieldValues) {
      if (value instanceof File) {
        if (!value.name || value.size <= 0) {
          break;
        }

        value = await addAwaitedArrayBuffer(value);
        if (formData.has(fieldName)) {
          formData.append(fieldName, value);
        } else {
          formData.set(fieldName, value);
        }
      }
    }
  }

  return formData;
};
