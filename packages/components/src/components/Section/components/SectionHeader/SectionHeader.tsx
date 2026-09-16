import type { FC, PropsWithChildren, RefAttributes } from "react";
import styles from "./SectionHeader.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import {
  overlayTriggersTunneledTo,
  PropsContextProvider,
} from "@/lib/propsContext";
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

    const actionsTunnel = {
      id: "actions",
      component: "SectionHeader",
    } as const;

    const propsContext: PropsContext = {
      ...overlayTriggersTunneledTo(actionsTunnel),
      Switch: {
        labelPosition: "leading",
        tunnel: actionsTunnel,
      },
      Button: {
        size: "s",
        tunnel: actionsTunnel,
      },
      ActionGroup: {
        preserveOrder: true,
        size: "s",
        tunnel: actionsTunnel,
        Button: {
          tunnel: null,
        },
        Switch: {
          tunnel: null,
        },
        Link: {
          tunnel: null,
        },
      },
      FileField: {
        tunnel: actionsTunnel,
        Button: { size: "s" },
      },
      Action: {
        tunnel: actionsTunnel,
        Button: {
          tunnel: null,
        },
      },
      Heading: {
        level: 2,
      },
      Link: {
        size: "s",
        tunnel: actionsTunnel,
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
