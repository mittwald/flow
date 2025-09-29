import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit } from "@mittwald/react-tunnel";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {
  /**
   * Whether the label should appear before or after the switch. @default
   * "trailing"
   */
  labelPosition?: "leading" | "trailing";
}

/** @flr-generate all */
export const Switch = flowComponent("Switch", (props) => {
  const {
    children,
    className,
    labelPosition = "trailing",
    ref,
    inputRef,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.switch,
    styles[`label-${labelPosition}` as keyof typeof styles],
    className,
  );

  const localSwitchRef = useObjectRef(ref);
  const localInputRef = useObjectRef(inputRef);

  useMakeFocusable(localSwitchRef, () => {
    localInputRef.current?.focus();
  });

  return (
    <PropsContextProvider
      props={{
        Label: {
          tunnelId: "label",
          className: styles.label,
        },
      }}
    >
      <Aria.Switch
        {...rest}
        className={rootClassName}
        ref={localSwitchRef}
        inputRef={localInputRef}
      >
        {({ isSelected }) => (
          <>
            <div className={styles.track}>
              <div className={styles.handle}>
                {isSelected ? <IconCheck size="s" /> : <IconClose size="s" />}
              </div>
            </div>
            <TunnelExit id="label" />
          </>
        )}
      </Aria.Switch>
      {children}
    </PropsContextProvider>
  );
});

export default Switch;
