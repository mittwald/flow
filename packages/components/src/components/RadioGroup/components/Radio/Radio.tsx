import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Radio = flowComponent<"Radio", HTMLLabelElement>(
  "Radio",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const rootClassName = clsx(styles.radio, className);

    return (
      <ClearPropsContext>
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
      </ClearPropsContext>
    );
  },
);

export default Radio;
