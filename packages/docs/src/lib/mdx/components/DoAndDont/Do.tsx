import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconCheck } from "@mittwald/flow-react-components/Icons";
import { Section } from "@mittwald/flow-react-components/Section";

interface Props extends PropsWithChildren {
  title?: string;
}

export const Do: FC<Props> = (props) => {
  return (
    <Section className={styles.do}>
      <Heading level={4}>
        {props.title ?? (
          <>
            <IconCheck /> Do
          </>
        )}
      </Heading>
      {props.children}
    </Section>
  );
};

export default Do;
