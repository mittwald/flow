import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Section } from "@mittwald/flow-react-components/Section";

export const Do: FC<PropsWithChildren> = (props) => {
  return <Section className={styles.do}>{props.children}</Section>;
};

export default Do;
