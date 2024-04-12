import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconClose } from "@mittwald/flow-react-components/Icons";
import { Section } from "@mittwald/flow-react-components/Section";

export const Dont: FC<PropsWithChildren> = (props) => {
  return (
    <Section className={styles.dont}>
      <Heading level={4}>
        <IconClose /> Don`t
      </Heading>
      {props.children}
    </Section>
  );
};

export default Dont;
