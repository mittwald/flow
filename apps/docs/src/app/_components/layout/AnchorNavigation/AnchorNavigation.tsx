import {
  LayoutCard,
  Navigation,
  Link,
  Heading,
  Section,
} from "@mittwald/flow-react-components";
import React, { type FC } from "react";
import styles from "../../../layout.module.scss";

interface Props {
  anchors: string[];
  title: string;
}

export const AnchorNavigation: FC<Props> = (props) => {
  const { anchors, title } = props;

  if (anchors.length === 0) {
    return null;
  }

  return (
    <LayoutCard className={styles.anchorNavigation}>
      <Section>
        <Heading level={4}>{title}</Heading>
        <Navigation>
          {anchors.map((a) => (
            <Link key={a}>{a}</Link>
          ))}
        </Navigation>
      </Section>
    </LayoutCard>
  );
};

export default AnchorNavigation;
