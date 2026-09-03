import type { FC } from "react";
import { IconFile, IconImage } from "@/components/Icon/components/icons";
import { Avatar as AvatarComponent } from "@/components/Avatar";
import { Image } from "@/components/Image";

interface Props {
  type?: string;
  imageSrc?: string;
  isFailed?: boolean;
}

export const Avatar: FC<Props> = (props) => {
  const { type, imageSrc, isFailed } = props;

  if (isFailed) {
    return <AvatarComponent status="danger" />;
  }

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
