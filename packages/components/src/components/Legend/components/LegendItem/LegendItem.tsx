import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import clsx from "clsx";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface LegendItemProps extends PropsWithChildren {
  color?: CategoricalWithCustomColor;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color: colorFromProps } = props;

  const isSkeleton = useSkeletonMode();

  const color = colorFromProps
    ? isCategoricalColor(colorFromProps)
      ? `var(--color--categorical--${colorFromProps})`
      : colorFromProps
    : undefined;

  return (
    <li className={styles.legendItem} inert={isSkeleton || undefined}>
      <div
        style={
          colorFromProps && !isSkeleton ? { backgroundColor: color } : undefined
        }
        className={clsx(styles.colorSquare, isSkeleton && styles.skeleton)}
      />
      <Text>
        <small>{children}</small>
      </Text>
    </li>
  );
};

export default LegendItem;
