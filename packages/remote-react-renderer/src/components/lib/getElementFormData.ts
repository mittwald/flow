import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

export const getElementFormData = async (
  element: HTMLFormElement,
): Promise<FormData> => {
  const formData = new FormData(element);

  // remote file uploads muss be added an awaited ArrayBuffer to
  // transfer the file data to the remote environment
  const inputElements = [...element.elements]
    .filter(
      (element) =>
        (element &&
          "name" in element &&
          typeof element.name === "string" &&
          element.getAttribute("disabled") === undefined) ||
        element.getAttribute("disabled") !== "disabled",
    )
    .filter(
      (matchingElement): matchingElement is HTMLInputElement =>
        matchingElement instanceof HTMLInputElement &&
        matchingElement.type === "file",
    );

  for (const element of inputElements) {
    const fieldName = element.name;
    formData.delete(fieldName);
    for (const file of element.files ?? []) {
      await addAwaitedArrayBuffer(file);

      if (formData.has(fieldName)) {
        formData.append(fieldName, file);
      } else {
        formData.set(fieldName, file);
      }
    }
  }

  return formData;
};
