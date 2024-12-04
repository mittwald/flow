import type { FC } from "react";
import React from "react";
import { Image } from "@/components/Image";
import { Avatar } from "@/components/Avatar";
import styles from "./SecondaryNavigation.module.scss";
import { Initials } from "@/components/Initials";
import clsx from "clsx";

interface Props {
  imgSrc?: string;
  title: string;
  rounded?: boolean;
}

export const SecondaryNavigationAvatar: FC<Props> = (props) => {
  const { imgSrc, title, rounded } = props;

  return (
    <div
      className={clsx(
        styles.avatarContainer,
        rounded && imgSrc && styles.rounded,
      )}
    >
      {imgSrc && rounded && (
        <Image className={styles.background} aria-hidden src={imgSrc} />
      )}
      <Avatar className={styles.avatar}>
        {!imgSrc && <Initials className={styles.initials}>{title}</Initials>}
        {imgSrc && <Image alt={title} src={imgSrc} />}
      </Avatar>
    </div>
  );
};

export default SecondaryNavigationAvatar;
