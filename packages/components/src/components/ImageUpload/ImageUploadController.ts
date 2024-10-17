import { useRef } from "react";
import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import type { Area } from "react-easy-crop";

export class ImageUploadController {
  public url?: string;
  public imageSrc?: string;
  public croppedArea?: Area;

  public constructor() {
    makeObservable(this, {
      url: observable,
      imageSrc: observable,
      croppedArea: observable,
      drawImage: action.bound,
    });
  }

  public static useNew(): ImageUploadController {
    return useRef(new ImageUploadController()).current;
  }

  public drawImage(canvas: HTMLCanvasElement, width: number, height: number) {
    const context = canvas.getContext("2d");

    const image = new Image(width, height);

    if (this.imageSrc) {
      image.src = this.imageSrc;
    }

    if (context && this.croppedArea) {
      context.drawImage(
        image,
        this.croppedArea.x,
        this.croppedArea.y,
        this.croppedArea.width,
        this.croppedArea.height,
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

  public useCroppedArea(): Area | undefined {
    return useSelector(() => this.croppedArea);
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

  public setCroppedArea(croppedArea: Area) {
    this.croppedArea = croppedArea;
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
