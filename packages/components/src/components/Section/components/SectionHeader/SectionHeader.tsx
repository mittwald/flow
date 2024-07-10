import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./SectionHeader.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export type SectionHeaderProps = PropsWithChildren & PropsWithClassName;

export const SectionHeader: FC<SectionHeaderProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.sectionHeader, className);

  const propsContext: PropsContext = {
    Switch: {
      labelPosition: "leading",
    },
    Button: {
      size: "s",
    },
    Heading: {
      level: 2,
      className: styles.heading,
      tunnelId: "heading",
    },
  };

  return (
    <header className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="heading" />
          <div className={styles.actions}>{children}</div>
        </TunnelProvider>
      </PropsContextProvider>
    </header>
  );
};

export default SectionHeader;
