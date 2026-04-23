import type { FC, PropsWithChildren, RefAttributes } from "react";
import styles from "./SectionHeader.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export type SectionHeaderProps = PropsWithChildren &
  PropsWithClassName &
  RefAttributes<HTMLHeadingElement>;

export const SectionHeader: FC<SectionHeaderProps> = flowComponent(
  "SectionHeader",
  (props) => {
    const { children, className, ref } = props;

    const rootClassName = clsx(styles.sectionHeader, className);

    const propsContext: PropsContext = {
      Switch: {
        labelPosition: "leading",
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
      },
      Button: {
        size: "s",
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
      },
      FileField: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
        Button: { size: "s" },
      },
      ContextMenuTrigger: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
        Button: {
          tunnel: null,
        },
      },
      PopoverTrigger: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
        Button: {
          tunnel: null,
        },
      },
      ContextualHelpTrigger: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
        Button: {
          tunnel: null,
        },
      },
      Action: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
        Button: {
          tunnel: null,
        },
      },
      Heading: {
        level: 2,
      },
      Link: {
        tunnel: {
          id: "actions",
          component: "SectionHeader",
        },
      },
    };

    return (
      <header ref={ref} className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
          <div className={styles.actions}>
            <UiComponentTunnelExit id="actions" component="SectionHeader" />
          </div>
        </PropsContextProvider>
      </header>
    );
  },
  {
    type: "layout",
  },
);

export default SectionHeader;
