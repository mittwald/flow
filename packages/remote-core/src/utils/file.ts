export const resolveFileContents = (file: unknown) => {
  if (!(file instanceof File)) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array((event.target?.result as ArrayBuffer) ?? 0);

      resolve({
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        size: file.size,
        content: [...data],
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
