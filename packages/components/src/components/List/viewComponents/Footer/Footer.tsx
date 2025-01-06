import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Footer.module.scss";

export const Footer: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <div className={styles.footer}>{children}</div>;
};

export default Footer;
