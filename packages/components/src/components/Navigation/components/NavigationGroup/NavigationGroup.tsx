import { type ComponentProps, type PropsWithChildren } from "react";
import { useId } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Accordion } from "@/components/Accordion";
import { Content } from "@/components/Content";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { LinkListTunnelExit } from "@/components/Navigation/components/LinkListTunnelExit/LinkListTunnelExit";

export interface NavigationGroupProps
  extends
    PropsWithChildren<ComponentProps<"section">>,
    FlowComponentProps<HTMLElement> {
  collapsable?: boolean;
}

/** @flr-generate all */
export const NavigationGroup = flowComponent("NavigationGroup", (props) => {
  const { children, className, collapsable, ...rest } = props;

  const rootClassName = clsx(
    styles.navigationGroup,
    collapsable && styles.collapsable,
    className,
  );

  const generatedId = useId();

  const propsContext: PropsContext = {
    Label: {
      id: generatedId,
      className: styles.label,
    },
    Link: {
      tunnel: {
        id: "groupLinks",
        component: "NavigationGroup",
      },
    },
  };

  const collapsableUi = (
    <Accordion defaultExpanded className={rootClassName}>
      {children}
      <Content>
        <LinkListTunnelExit id="groupLinks" component="NavigationGroup" />
      </Content>
    </Accordion>
  );

  const defaultUi = (
    <section aria-labelledby={generatedId} className={rootClassName} {...rest}>
      {children}
      <LinkListTunnelExit id="groupLinks" component="NavigationGroup" />
    </section>
  );

  return (
    <PropsContextProvider props={propsContext} dependencies={[generatedId]}>
      {collapsable ? collapsableUi : defaultUi}
    </PropsContextProvider>
  );
});

export default NavigationGroup;
