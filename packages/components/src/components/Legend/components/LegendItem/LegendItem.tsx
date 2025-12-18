import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import type { CategoricalColor } from "@/lib/tokens/CategoricalColors";
import clsx from "clsx";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

export interface LegendItemProps extends PropsWithChildren {
  color?: CategoricalColor | (string & {});
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color: colorFromProps } = props;

  const color = colorFromProps
    ? isCategoricalColor(colorFromProps)
      ? `var(--color--categorical--${colorFromProps})`
      : colorFromProps
    : undefined;

  return (
    <li className={styles.legendItem}>
      <div
        style={colorFromProps ? { backgroundColor: color } : undefined}
        className={clsx(styles.colorSquare)}
      />
      <Text>
        <small>{children}</small>
      </Text>
    </li>
  );
};

export default LegendItem;
