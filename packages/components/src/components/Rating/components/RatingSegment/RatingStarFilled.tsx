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
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
      >
        <path d="M320.2 11.2L227.6 192.6L26.5 224.6L170.4 368.7L138.7 569.9L320.2 477.6L501.7 569.9L470 368.7L613.9 224.6L412.8 192.6L320.2 11.2z" />
      </svg>
    </Icon>
  );
};
