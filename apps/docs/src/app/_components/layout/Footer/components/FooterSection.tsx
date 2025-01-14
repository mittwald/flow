import styles from "./FooterSection.module.scss";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Heading } from "@mittwald/flow-react-components/Heading";

export interface FooterSectionProps extends PropsWithChildren {
  title: string;
}

export const FooterSection: FC<FooterSectionProps> = ({ children, title }) => (
  <div className={styles.footerSection}>
    <Heading level={3}>{title}</Heading>
    <div className={styles.footerSectionContent}>{children}</div>
  </div>
);
