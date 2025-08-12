import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import type { CategoricalColor } from "@/lib/tokens/CategoricalColors";
import clsx from "clsx";

export interface LegendItemProps extends PropsWithChildren {
  color?: CategoricalColor;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color } = props;

  return (
    <li className={styles.legendItem}>
      <div
        className={clsx(styles.colorSquare, color && styles[`color-${color}`])}
      />
      <Text>
        <small>{children}</small>
      </Text>
    </li>
  );
};

export default LegendItem;
