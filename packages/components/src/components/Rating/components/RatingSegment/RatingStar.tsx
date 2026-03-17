import React, { type FC } from "react";
import type { RatingProps } from "@/components/Rating";
import { Icon } from "@/components/Icon";
import styles from "../../Rating.module.scss";

interface Props {
  size: RatingProps["size"];
}

export const RatingStar: FC<Props> = (props) => {
  const { size } = props;

  return (
    <Icon aria-hidden size={size} className={styles.star}>
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
      >
        <path d="M320.2 11.2C326.1 22.9 357 83.3 412.8 192.6C534 211.9 601 222.5 613.9 224.6C604.7 233.9 556.7 281.9 470 368.7C489.1 489.9 499.7 556.9 501.7 569.9C490 564 429.5 533.2 320.2 477.6C210.9 533.2 150.4 564 138.7 569.9C140.7 557 151.3 489.9 170.4 368.7C83.7 281.9 35.7 233.9 26.5 224.6C39.4 222.5 106.5 211.9 227.6 192.6C283.4 83.3 314.2 22.9 320.2 11.2zM320.2 116.8L264.8 225.3L259.2 236.2L247.1 238.1L126.8 257.2L212.9 343.4L221.5 352L219.6 364.1L200.6 484.4L309.2 429.2L320.1 423.7L331 429.2L439.6 484.4L420.6 364.1L418.7 352L427.3 343.4L513.4 257.2L393.1 238.1L381 236.2L375.4 225.3L320 116.8z" />
      </svg>
    </Icon>
  );
};
