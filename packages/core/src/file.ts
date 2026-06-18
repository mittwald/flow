import invariant from "invariant";

const Key = "mittwald.flow-core.file.awaitedArrayBuffer";

export type FileWithAwaitedArrayBuffer = File & {
  [Key]: ArrayBuffer;
};

export function isFileWithAwaitedArrayBuffer(
  file: File | FileWithAwaitedArrayBuffer,
): file is FileWithAwaitedArrayBuffer {
  return Key in file && file[Key] instanceof ArrayBuffer && !file[Key].detached;
}

export const addAwaitedArrayBuffer = async (file: File) => {
  if (isFileWithAwaitedArrayBuffer(file)) {
    return file;
  }

  const arrayBuffer = await file.arrayBuffer();
  Object.assign(file, { [Key]: arrayBuffer });

  return file;
};

export const getAwaitArrayBuffer = (
  file: File | FileWithAwaitedArrayBuffer,
) => {
  invariant(
    isFileWithAwaitedArrayBuffer(file),
    `File buffer unavailable (objectType=${Object.prototype.toString.call(
      file,
    )}, hasArrayBuffer=${
      Key in file && file[Key] instanceof ArrayBuffer
    }, isDetached=${
      Key in file && file[Key] instanceof ArrayBuffer
        ? file[Key].detached
        : "n/a"
    })`,
  );
  return file[Key];
};
