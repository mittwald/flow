import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const prepareFormData = async (
  formData: FormData,
): Promise<FormData> => {
  const preparedFormData = new FormData();
  for (const [fieldName, value] of formData) {
    const preparedValue = value;
    if (preparedValue instanceof File) {
      if (!preparedValue.name || preparedValue.size <= 0) {
        break;
      }

      await addAwaitedArrayBuffer(preparedValue);
    }

    if (preparedFormData.has(fieldName)) {
      preparedFormData.append(fieldName, preparedValue);
    } else {
      preparedFormData.set(fieldName, preparedValue);
    }
  }

  return preparedFormData;
};
