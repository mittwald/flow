import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import {
  categoricalColors,
  type CategoricalColors,
} from "@/lib/tokens/CategoricalColors";
import { getCategoricalColorValue } from "@/lib/tokens/getCategoricalColorValue";

export interface LegendItemProps extends PropsWithChildren {
  color?: CategoricalColors | string;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color } = props;

  return (
    <li className={styles.legendItem}>
      <div
        className={styles.colorSquare}
        style={{
          backgroundColor: categoricalColors.includes(
            color as CategoricalColors,
          )
            ? getCategoricalColorValue(color as CategoricalColors)
            : color,
        }}
      />
      <Text>
        <small>{children}</small>
      </Text>
    </li>
  );
};

export default LegendItem;
