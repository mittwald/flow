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
        width="21"
        height="20"
        viewBox="0 0 21 20"
        stroke="currentColor"
        fill="transparent"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8149 7.12305L12.9917 7.51758L13.4214 7.56348L19.1714 8.16992L14.8765 12.04L14.5552 12.3301L14.645 12.7529L15.8442 18.4082L10.8364 15.5205L10.4614 15.3037L10.0864 15.5205L5.07764 18.4082L6.27783 12.7529L6.36768 12.3301L6.04639 12.04L1.75049 8.16992L7.50146 7.56348L7.93115 7.51758L8.10791 7.12305L10.4614 1.8418L12.8149 7.12305Z"
          stroke-width="1.5"
        />
      </svg>
    </Icon>
  );
};
