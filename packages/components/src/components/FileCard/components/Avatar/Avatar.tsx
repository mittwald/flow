import type { FC } from "react";
import { IconFile } from "@/components/Icon/components/icons";
import { Avatar as AvatarComponent } from "@/components/Avatar";
import { Image } from "@/components/Image";
import Icon from "@/components/Icon";
import { IconPhoto } from "@tabler/icons-react";

interface Props {
  type?: string;
  imageSrc?: string;
  isFailed?: boolean;
}

export const Avatar: FC<Props> = (props) => {
  const { type, imageSrc, isFailed, ...rest } = props;

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
    <AvatarComponent color="blue" {...rest}>
      {type?.startsWith("image") ? (
        <Icon>
          <IconPhoto />
        </Icon>
      ) : (
        <IconFile />
      )}
    </AvatarComponent>
  );
};
export default Avatar;
