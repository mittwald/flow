import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Footer.module.scss";

export type FooterProps = PropsWithChildren;

/** @flr-generate all */
export const Footer: FC<FooterProps> = (props) => {
  const { children } = props;

  return <div className={styles.footer}>{children}</div>;
};

export default Footer;
