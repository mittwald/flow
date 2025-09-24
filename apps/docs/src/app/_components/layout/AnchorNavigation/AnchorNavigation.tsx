import {
  Heading,
  LayoutCard,
  Link,
  Navigation,
  Section,
} from "@mittwald/flow-react-components";
import React, { type FC } from "react";
import styles from "../../../layout.module.scss";

interface Props {
  anchors: string[];
  title: string;
  currentPath: string;
}

export const AnchorNavigation: FC<Props> = (props) => {
  const { anchors, title, currentPath } = props;

  if (anchors.length === 0) {
    return null;
  }

  return (
    <LayoutCard className={styles.anchorNavigation}>
      <Section>
        <Heading level={4}>{title}</Heading>
        <Navigation>
          {anchors.map((a) => {
            const slug = a.replace(/[^a-zA-Z]/g, "").toLowerCase();

            return (
              <Link href={`${currentPath}#${slug}`} key={a}>
                {a}
              </Link>
            );
          })}
        </Navigation>
      </Section>
    </LayoutCard>
  );
};

export default AnchorNavigation;
