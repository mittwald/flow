import { useRef } from "react";
import { action, makeObservable, observable } from "mobx";
import type { Area } from "react-easy-crop";
import useSelector from "@/lib/mobx/useSelector";

export class CanvasController {
  public url?: string;

  public constructor() {
    makeObservable(this, {
      url: observable,
      drawImage: action.bound,
    });
  }

  public static useNew(): CanvasController {
    return useRef(new CanvasController()).current;
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
}

export default CanvasController;
