import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Section } from "@mittwald/flow-react-components/Section";

export const Dont: FC<PropsWithChildren> = (props) => {
  return <Section className={styles.dont}>{props.children}</Section>;
};

export default Dont;
