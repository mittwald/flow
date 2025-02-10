import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";

export const ExamplesContainer: FC<PropsWithChildren> = (props) => {
  return <div className={styles.doAndDont}>{props.children}</div>;
};

export default ExamplesContainer;
