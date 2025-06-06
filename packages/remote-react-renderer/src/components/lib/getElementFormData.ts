import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const getElementFormData = async (
  element: HTMLFormElement,
): Promise<{ formData: FormData; object: Record<string, unknown> }> => {
  const formData = new FormData(element);
  const data: Record<string, unknown> = Object.fromEntries(formData);

  // file and select elements with multiple values are not correctly returned
  // by getValues over FormData so we handle them by our self
  const inputOrSelectElements = [...element.elements]
    .filter(
      (element) =>
        (element &&
          "name" in element &&
          typeof element.name === "string" &&
          element.getAttribute("disabled") === undefined) ||
        element.getAttribute("disabled") !== "disabled",
    )
    .filter(
      (
        matchingElement,
      ): matchingElement is HTMLInputElement | HTMLSelectElement =>
        (matchingElement instanceof HTMLInputElement &&
          (matchingElement.type === "file" ||
            matchingElement.type === "checkbox")) ||
        matchingElement instanceof HTMLSelectElement,
    );

  for (const element of inputOrSelectElements) {
    const fieldName = element.name;
    if (element instanceof HTMLInputElement) {
      if (element.type === "file") {
        const dataTransfer = new DataTransfer();
        formData.delete(fieldName);

        for (const file of element.files ?? []) {
          await addAwaitedArrayBuffer(file);

          if (formData.has(fieldName)) {
            formData.append(fieldName, file);
          } else {
            formData.set(fieldName, file);
          }

          dataTransfer.items.add(file);
        }
        data[fieldName] = dataTransfer.files;
      } else {
        const multiple =
          inputOrSelectElements.filter(
            (e) =>
              e instanceof HTMLInputElement &&
              e.type === "checkbox" &&
              e.name === fieldName,
          ).length >= 2;
        const checkBoxValue = element.checked ? element.value : "";
        if (multiple) {
          let checkBoxData = data[fieldName] as string[] | string;
          if (typeof checkBoxData === "undefined") {
            checkBoxData = [];
          } else if (typeof checkBoxData === "string") {
            checkBoxData = [checkBoxData];
          }

          if (element.checked) {
            if (!checkBoxData.includes(checkBoxValue)) {
              checkBoxData.push(checkBoxValue);
            }
          } else {
            checkBoxData = checkBoxData.filter((d) => d !== checkBoxValue);
          }
          data[fieldName] = checkBoxData;
        } else {
          data[fieldName] = checkBoxValue;
        }
      }
    } else {
      formData.delete(fieldName);
      formData.set(fieldName, element.value);
      data[fieldName] = element.value;
    }
  }

  return {
    formData,
    object: data,
  };
};
