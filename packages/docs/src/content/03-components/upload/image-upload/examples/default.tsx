import {
  ImageUpload,
  useImageUploadController,
} from "@mittwald/flow-react-components/ImageUpload";

export default () => {
  const controller = useImageUploadController();

  return <ImageUpload controller={controller} />;
};
