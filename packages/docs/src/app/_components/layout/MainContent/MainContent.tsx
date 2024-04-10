import type { FC, PropsWithChildren, ReactNode } from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import styles from "./MainContent.module.css";
import { Link } from "@mittwald/flow-react-components/Link";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Section } from "@mittwald/flow-react-components/Section";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";

interface Props extends PropsWithChildren {
  title?: ReactNode;
  description?: ReactNode;
  component?: string;
}

export const MainContent: FC<Props> = (props) => {
  const { title, component, children } = props;

  return (
    <>
      <LayoutCard elementType="main">
        <Text style={{ color: "orange" }}>Breadcrumb</Text>
        <ColumnLayout m={[1, 1]}>
          <Section>
            <Heading className={styles.heading} level={1}>
              {title}
            </Heading>

            <Text>{children}</Text>

            {component && (
              <Link
                href={`https://github.com/mittwald/flow/tree/main/packages/components/src/components/${component}`}
              >
                {component}
              </Link>
            )}
          </Section>
          <Text style={{ color: "orange" }}>Beispiel ohne Code</Text>
        </ColumnLayout>
      </LayoutCard>
    </>
  );
};

export default MainContent;
