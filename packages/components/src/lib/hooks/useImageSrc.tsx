import { useEffect, useEffectEvent, useState } from "react";

export const useImageSrc = (image?: string | File) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  const onImageChange = useEffectEvent(() => {
    if (image) {
      if (typeof image === "string") {
        setImageSrc(image);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImageSrc(reader.result);
          }
        };
        reader.readAsDataURL(image);
      }
    }
  });

  useEffect(() => {
    onImageChange();
  }, [image]);

  return imageSrc;
};
