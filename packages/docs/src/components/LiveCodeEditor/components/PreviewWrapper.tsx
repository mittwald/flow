"use client";
import { FC, PropsWithChildren } from "react";
import styles from "../LiveCodeEditor.module.css";

export const PreviewWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.preview}>{children}</div>;
};
