import { type FC } from "react";
import type { RatingProps } from "@/components/Rating";
import styles from "../../Rating.module.scss";
import { IconStarFilled } from "@/components/Icon/components/icons";

interface Props {
  size: RatingProps["size"];
}

export const RatingStarFilled: FC<Props> = (props) => {
  const { size } = props;

  return (
    <IconStarFilled aria-hidden size={size} className={styles.starFilled} />
  );
};
