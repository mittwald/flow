import type { FC, PropsWithChildren, ReactNode } from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import styles from "./MainContent.module.css";
import { Link } from "@mittwald/flow-react-components/Link";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Section } from "@mittwald/flow-react-components/Section";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";

interface Props extends PropsWithChildren {
  title?: ReactNode;
  description?: ReactNode;
  component?: string;
}

export const MainContent: FC<Props> = (props) => {
  const { title, description, component, children } = props;

  return (
    <>
      <LayoutCard>
        <ColumnLayout m={component ? [1, 1] : [1]}>
          <Section>
            <Heading className={styles.heading} level={1}>
              {title}
            </Heading>
            {description}

            {component && (
              <Link
                href={`https://github.com/mittwald/flow/tree/main/packages/components/src/components/${component}`}
              >
                GitHub
                <IconExternalLink />
              </Link>
            )}
          </Section>
          {children}
        </ColumnLayout>
      </LayoutCard>
    </>
  );
};

export default MainContent;
