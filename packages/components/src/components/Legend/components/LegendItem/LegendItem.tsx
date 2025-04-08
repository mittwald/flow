import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import { type CategoricalColors } from "@/lib/tokens/CategoricalColors";
import { getCategoricalColorValue } from "@/lib/tokens/getCategoricalColorValue";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export interface LegendItemProps extends PropsWithChildren {
  color?: CategoricalColors;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color } = props;
  return (
    <li className={styles.legendItem}>
      <div
        className={styles.colorSquare}
        style={{
          backgroundColor: color
            ? getCategoricalColorValue(color)
            : tokens.color.gray[100].value,
        }}
      />
      <Text>
        <small>{children}</small>
      </Text>
    </li>
  );
};

export default LegendItem;
