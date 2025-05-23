import type { FormEvent } from "react";

export const getFormDataObject = (
  formData: FormData,
): Record<string, unknown> =>
  Object.fromEntries(Array.from(formData.entries()));

export const getFormDataObjectFromEvent = (
  e: FormEvent<HTMLFormElement>,
): Record<string, unknown> => {
  const form = new FormData(e.currentTarget);
  const formKeys = form.keys().toArray();
  const data: Record<string, unknown> = Object.fromEntries(form);

  // file and select elements with multiple values are not correctly returned
  // by getValues over FormData so we handle them by our self
  [...e.currentTarget.elements]
    .filter(
      (e) =>
        e &&
        "name" in e &&
        typeof e.name === "string" &&
        formKeys.includes(e.name),
    )
    .filter(
      (element): element is HTMLInputElement | HTMLSelectElement =>
        (element instanceof HTMLInputElement && element.type === "file") ||
        element instanceof HTMLSelectElement,
    )
    .forEach((element) => {
      const fieldName = element.name;
      if (element instanceof HTMLInputElement) {
        data[fieldName] = element.files ?? new FileList();
      } else {
        data[fieldName] = element.value;
      }
    });

  return data;
};
