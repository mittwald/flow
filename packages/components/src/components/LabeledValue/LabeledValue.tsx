import type { PropsWithChildren } from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LabeledValueProps
  extends PropsWithChildren, PropsWithClassName {}

/** @flr-generate all */
export const LabeledValue = flowComponent("LabeledValue", (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.labeledValue, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      elementType: "dt",
      tunnel: {
        id: "label",
        component: "LabeledValue",
      },
    },
    CopyButton: {
      variant: "plain",
      size: "s",
    },
    Button: {
      size: "s",
    },
    Link: {
      inline: true,
    },
  };

  return (
    <dl className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <UiComponentTunnelExit id="label" component="LabeledValue" />
        <dd>{children}</dd>
      </PropsContextProvider>
    </dl>
  );
});

export default LabeledValue;
