import type { FormEvent } from "react";

export const getFormDataObject = (
  formData: FormData,
): Record<string, unknown> =>
  Object.fromEntries(Array.from(formData.entries()));

export const getFormDataObjectFromEvent = (
  element: FormEvent<HTMLFormElement>,
): Record<string, unknown> => {
  const form = new FormData(element.currentTarget);
  const formKeys = form.keys().toArray();
  const data: Record<string, unknown> = Object.fromEntries(form);

  // file and select elements with multiple values are not correctly returned
  // by getValues over FormData so we handle them by our self
  [...element.currentTarget.elements]
    .filter(
      (element) =>
        element &&
        "name" in element &&
        typeof element.name === "string" &&
        formKeys.includes(element.name),
    )
    .filter(
      (
        matchingElement,
      ): matchingElement is HTMLInputElement | HTMLSelectElement =>
        (matchingElement instanceof HTMLInputElement &&
          matchingElement.type === "file") ||
        matchingElement instanceof HTMLSelectElement,
    )
    .forEach((matchingFileElement) => {
      const fieldName = matchingFileElement.name;
      if (matchingFileElement instanceof HTMLInputElement) {
        data[fieldName] = matchingFileElement.files ?? new FileList();
      } else {
        data[fieldName] = matchingFileElement.value;
      }
    });

  return data;
};
