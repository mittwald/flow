import Text from "@/components/Text";
import type { FC, PropsWithChildren } from "react";
import styles from "./LegendItem.module.scss";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import clsx from "clsx";
import { useCategoricalColorValue } from "@/lib/tokens/useCategoricalColorValue";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface LegendItemProps extends PropsWithChildren {
  /**
   * The color of the item's square.
   *
   * @deprecatedValues sea-green, palatinate-blue, tangerine, magenta, tropical-indigo,
   *   malachite, azure, yellow, alloy-orange, lime
   */
  color?: CategoricalWithCustomColor;
}

export const LegendItem: FC<LegendItemProps> = (props) => {
  const { children, color: colorFromProps } = props;

  const isSkeleton = useSkeletonMode();
  const categoricalColorValue = useCategoricalColorValue();

  const color = colorFromProps
    ? categoricalColorValue(colorFromProps)
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
