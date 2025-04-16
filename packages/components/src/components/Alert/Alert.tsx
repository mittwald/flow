import { AlertIcon } from "@/components/AlertIcon";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import type { PropsWithStatus } from "@/lib/types/props";
import clsx from "clsx";
import type { ComponentProps, PropsWithChildren } from "react";
import styles from "./Alert.module.scss";

export interface AlertProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    PropsWithStatus,
    FlowComponentProps<HTMLElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Alert = flowComponent("Alert", (props) => {
  const { children, className, status = "info", ref, ...rest } = props;

  const rootClassName = clsx(styles.alert, styles[status], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
      size: "s",
      children: dynamic((props) => (
        <>
          <AlertIcon status={status} className={styles.icon} />
          {props.children}
        </>
      )),
    },
    Content: {
      className: styles.content,
      Button: {
        size: "s",
      },
    },
  };

  return (
    <ClearPropsContext>
      <aside {...rest} className={rootClassName} ref={ref}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </aside>
    </ClearPropsContext>
  );
});

export default Alert;
