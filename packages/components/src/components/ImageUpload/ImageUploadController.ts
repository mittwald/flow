import { useRef } from "react";
import { action, makeObservable, observable } from "mobx";
import type { Area } from "react-easy-crop";
import useSelector from "@/lib/mobx/useSelector";

export class ImageUploadController {
  public url?: string;
  public imageSrc?: string;

  public constructor() {
    makeObservable(this, {
      url: observable,
      imageSrc: observable,
      drawImage: action.bound,
    });
  }

  public static useNew(): ImageUploadController {
    return useRef(new ImageUploadController()).current;
  }

  public drawImage(
    canvas: HTMLCanvasElement,
    imageSrc: string,
    croppedAreaPixels: Area,
    width: number,
    height: number,
  ) {
    const context = canvas.getContext("2d");

    const image = new Image(width, height);

    image.src = imageSrc;

    if (context) {
      context.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height,
      );

      this.url = context.canvas.toDataURL("image/png");
    }
  }

  public useUrl(): string | undefined {
    return useSelector(() => this.url);
  }

  public useImageSrc(): string | undefined {
    return useSelector(() => this.imageSrc);
  }

  public setImageSrc(files: File[]) {
    const reader = new FileReader();
    if (files.length > 0) {
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          this.imageSrc = event.target.result;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }

  public clearCanvas(canvas: HTMLCanvasElement | null) {
    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        context.reset();
      }

      this.url = undefined;
    }
  }
}

export default ImageUploadController;
