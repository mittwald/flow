export const createFileList = (files: File[]): FileList => {
  const list: FileList & Iterable<File> = {
    ...files,
    length: files.length,
    item: (index: number) => list[index] as File,
    [Symbol.iterator]: function* nextFile() {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < list.length; i++) {
        yield list[i] as File;
      }

      return undefined;
    },
  };
  list.constructor = window.FileList;

  // guard for environments without FileList
  /* istanbul ignore else */
  if (window.FileList) {
    Object.setPrototypeOf(list, window.FileList.prototype);
  }

  Object.freeze(list);

  return list;
};
