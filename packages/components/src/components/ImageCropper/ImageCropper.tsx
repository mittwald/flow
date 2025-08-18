import { type FC, useState } from "react";
import Cropper from "react-easy-crop";

export const ImageCropper: FC = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  return <Cropper crop={crop} onCropChange={setCrop}></Cropper>;
};

export default ImageCropper;
