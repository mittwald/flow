export const getFormDataObject = (
  formData: FormData,
): Record<string, unknown> =>
  Object.fromEntries(Array.from(formData.entries()));
