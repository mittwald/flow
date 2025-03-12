import Text from "@/components/Text";
import type { FC } from "react";
import styles from "./LegendItem.module.scss";

export interface LegendItemProps {
  color: string;
  title: string;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { title, color } = props;
  return (
    <div className={styles.legendItem}>
      <div className={styles.colorSquare} style={{ backgroundColor: color }} />
      <Text>
        <small>{title}</small>
      </Text>
    </div>
  );
};

export default LegendItem;
