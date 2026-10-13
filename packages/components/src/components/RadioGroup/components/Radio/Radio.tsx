import type { PropsWithChildren } from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { SkeletonRawText } from "@/components/SkeletonMode/components/SkeletonRawText";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface RadioProps
  extends
    PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {}

/** @flr-generate all */
export const Radio = flowComponent("Radio", (props) => {
  const { children, className, ref, ...rest } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(styles.radio, className);

  const onIcon = <IconRadioOn className={styles.icon} />;
  const offIcon = <IconRadioOff className={styles.icon} />;

  const renderIcon = (isSelected: boolean) => {
    const icon = isSelected ? onIcon : offIcon;

    const skeletonIcon = (
      <span className={styles.skeletonIcon}>
        <SkeletonModeReset>{icon}</SkeletonModeReset>
      </span>
    );

    return isSkeleton ? skeletonIcon : icon;
  };

  return (
    <Aria.Radio {...rest} className={rootClassName} ref={ref}>
      {({ isSelected }) => (
        <>
          {renderIcon(isSelected)}
          <SkeletonRawText>{children}</SkeletonRawText>
        </>
      )}
    </Aria.Radio>
  );
});

export default Radio;
