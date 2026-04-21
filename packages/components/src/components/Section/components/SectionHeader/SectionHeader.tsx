import type { FC, PropsWithChildren, RefAttributes } from "react";
import styles from "./SectionHeader.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { sectionHeaderTunnelProviderId } from "./config";

export type SectionHeaderProps = PropsWithChildren &
  PropsWithClassName &
  RefAttributes<HTMLHeadingElement>;

export const SectionHeader: FC<SectionHeaderProps> = (props) => {
  const { children, className, ref } = props;

  const rootClassName = clsx(styles.sectionHeader, className);

  const propsContext: PropsContext = {
    Switch: {
      labelPosition: "leading",
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
    },
    Button: {
      size: "s",
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
    },
    FileField: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
      Button: { size: "s" },
    },
    ContextMenuTrigger: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    PopoverTrigger: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    ContextualHelpTrigger: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    Action: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    Heading: {
      level: 2,
    },
    Link: {
      tunnelId: "actions",
      tunnelProviderId: sectionHeaderTunnelProviderId,
    },
  };

  return (
    <header ref={ref} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider id={sectionHeaderTunnelProviderId}>
          {children}
          <div className={styles.actions}>
            <TunnelExit
              id="actions"
              providerId={sectionHeaderTunnelProviderId}
            />
          </div>
        </TunnelProvider>
      </PropsContextProvider>
    </header>
  );
};

export default SectionHeader;
