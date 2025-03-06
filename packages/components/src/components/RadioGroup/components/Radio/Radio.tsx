import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Radio.module.scss";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const Radio = flowComponent<"Radio", HTMLLabelElement>(
  "Radio",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const rootClassName = clsx(styles.radio, className);

    return (
      <ClearPropsContextView>
        <Aria.Radio {...rest} className={rootClassName} ref={ref}>
          {({ isSelected }) => (
            <>
              {isSelected ? (
                <IconRadioOn className={styles.icon} />
              ) : (
                <IconRadioOff className={styles.icon} />
              )}
              {children}
            </>
          )}
        </Aria.Radio>
      </ClearPropsContextView>
    );
  },
);

export default Radio;
