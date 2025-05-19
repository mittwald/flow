import type { FC, PropsWithChildren, RefAttributes } from "react";
import styles from "./SectionHeader.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

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
    },
    Button: {
      size: "s",
      tunnelId: "actions",
    },
    FileField: { tunnelId: "actions", Button: { size: "s" } },
    ContextMenuTrigger: {
      tunnelId: "actions",
      Button: {
        tunnelId: null,
      },
    },
    PopoverTrigger: {
      tunnelId: "actions",
      Button: {
        tunnelId: null,
      },
    },
    ModalTrigger: {
      tunnelId: "actions",
      Button: {
        tunnelId: null,
      },
    },
    ContextualHelpTrigger: {
      tunnelId: "actions",
      Button: {
        tunnelId: null,
      },
    },
    Action: {
      tunnelId: "actions",
      Button: {
        tunnelId: null,
      },
    },
    Heading: {
      level: 2,
    },
    Link: {
      tunnelId: "actions",
    },
  };

  return (
    <header ref={ref} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}
          <div className={styles.actions}>
            <TunnelExit id="actions" />
          </div>
        </TunnelProvider>
      </PropsContextProvider>
    </header>
  );
};

export default SectionHeader;
