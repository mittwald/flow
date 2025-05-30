import { TRANSFERABLE } from "@quilted/threads";

export const resolveFileContents = async (file: unknown) => {
  if (!(file instanceof File)) {
    return file;
  }

  const arrayBuffer = await file.arrayBuffer();

  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    size: file.size,
    content: arrayBuffer,
    [TRANSFERABLE]: 1,
  };
};
