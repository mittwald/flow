import { useEffect, useState } from "react";

export const useImageSrc = (image?: string | File) => {
  const [src, setSrc] = useState(typeof image === "string" ? image : "");

  useEffect(() => {
    if (!image || typeof image === "string") {
      return;
    }

    const url = URL.createObjectURL(image);
    setSrc(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  return src;
};
