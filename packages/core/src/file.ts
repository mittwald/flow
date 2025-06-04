import invariant from "invariant";

const Key = "mittwald.flow-core.file.awaitedArrayBuffer";

export type FileWithAwaitedArrayBuffer = File & {
  [Key]: ArrayBuffer;
};

function isFileWithAwaitedArrayBuffer(
  file: File | FileWithAwaitedArrayBuffer,
): file is FileWithAwaitedArrayBuffer {
  return Key in file;
}

export const addAwaitedArrayBuffer = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  Object.assign(file, { [Key]: arrayBuffer });
};

export const getAwaitArrayBuffer = (
  file: File | FileWithAwaitedArrayBuffer,
) => {
  invariant(
    isFileWithAwaitedArrayBuffer(file),
    "Could not get awaited ArrayBuffer from file",
  );
  return file[Key];
};
