import type { FC } from "react";
import React from "react";
import IconImage from "../../../Icon/components/icons/IconImage";
import { IconFile } from "@/components/Icon/components/icons";
import { Avatar as AvatarComponent } from "@/components/Avatar";
import { Image } from "@/components/Image";

interface Props {
  type?: string;
  imageSrc?: string;
}

export const Avatar: FC<Props> = (props) => {
  const { type, imageSrc } = props;

  if (imageSrc) {
    return (
      <AvatarComponent>
        <Image src={imageSrc} />
      </AvatarComponent>
    );
  }

  return (
    <AvatarComponent color="blue">
      {type?.startsWith("image") ? <IconImage /> : <IconFile />}
    </AvatarComponent>
  );
};
export default Avatar;
