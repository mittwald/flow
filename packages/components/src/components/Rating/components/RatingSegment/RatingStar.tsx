import { type FC } from "react";
import type { RatingProps } from "@/components/Rating";
import styles from "../../Rating.module.scss";
import { IconStar } from "@/components/Icon/components/icons";

interface Props {
  size: RatingProps["size"];
}

export const RatingStar: FC<Props> = (props) => {
  const { size } = props;
  return <IconStar aria-hidden size={size} className={styles.star} />;
};
