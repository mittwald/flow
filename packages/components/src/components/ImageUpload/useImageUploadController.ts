import ImageUploadController from "@/components/ImageUpload/ImageUploadController";

export const useImageUploadController = (): ImageUploadController => {
  return ImageUploadController.useNew();
};
