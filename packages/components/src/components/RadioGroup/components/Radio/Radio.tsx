import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { ClearPropsContext } from "@/lib/propsContext";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {
  /** @internal */
  unstyled?: boolean;
}

export const Radio = flowComponent("Radio", (props) => {
  const { children, className, unstyled = false, ...rest } = props;

  const rootClassName = unstyled ? className : clsx(styles.radio, className);

  return (
    <ClearPropsContext>
      <Aria.Radio {...rest} className={rootClassName}>
        {({ isSelected }) => (
          <>
            {isSelected
              ? !unstyled && <IconRadioOn className={styles.icon} />
              : !unstyled && <IconRadioOff className={styles.icon} />}
            {children}
          </>
        )}
      </Aria.Radio>
    </ClearPropsContext>
  );
});

export default Radio;
