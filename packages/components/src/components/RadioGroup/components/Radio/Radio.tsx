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

  const renderIcon = (isSelected: boolean) => {
    const icon = isSelected ? (
      <IconRadioOn className={styles.icon} />
    ) : (
      <IconRadioOff className={styles.icon} />
    );

    return isSkeleton ? (
      <span className={styles.skeletonIcon}>
        <SkeletonModeReset>{icon}</SkeletonModeReset>
      </span>
    ) : (
      icon
    );
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
