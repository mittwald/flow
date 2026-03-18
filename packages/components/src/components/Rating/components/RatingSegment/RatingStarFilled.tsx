import React, { type FC } from "react";
import type { RatingProps } from "@/components/Rating";
import { Icon } from "@/components/Icon";
import styles from "../../Rating.module.scss";

interface Props {
  size: RatingProps["size"];
}

export const RatingStarFilled: FC<Props> = (props) => {
  const { size } = props;

  return (
    <Icon aria-hidden size={size} className={styles.starFilled}>
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.4614 0L13.5003 6.81738L20.923 7.60081L15.3784 12.5976L16.9271 19.8992L10.4614 16.17L3.99579 19.8992L5.54446 12.5976L-0.000195503 7.60081L7.42258 6.81738L10.4614 0Z" />
      </svg>
    </Icon>
  );
};
