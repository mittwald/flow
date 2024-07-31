import FileController from "@/components/FileTrigger/FileController";

export const useFileController = (): FileController => {
  return FileController.useNew();
};
