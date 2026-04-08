import type { FC } from "react";
import React from "react";
import {
  ColumnLayout,
  Flex,
  Heading,
  IconExternalLink,
  LayoutCard,
  Link,
  Section,
} from "@mittwald/flow-react-components";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "@/app/layout.module.scss";

interface Props {
  mdxFile: MdxFile;
}

export const TopContent: FC<Props> = (props) => {
  const { mdxFile } = props;

  const component = mdxFile.mdxSource.frontmatter.component;

  if (!component) {
    return (
      <LayoutCard className={styles.topContent}>
        <Flex gap="m" direction="column">
          <Heading level={1}>{mdxFile.getTitle()}</Heading>
          {mdxFile.mdxSource.frontmatter.description}
          <MdxFileView mdxFile={mdxFile.serialize()} />
        </Flex>
      </LayoutCard>
    );
  }

  return (
    <LayoutCard className={styles.topContent}>
      <ColumnLayout l={[1, 1]} m={[1]}>
        <Section>
          <Heading level={1}>{mdxFile.getTitle()}</Heading>

          {mdxFile.mdxSource.frontmatter.description}

          <Link href={mdxFile.getGitHubUrl()}>
            GitHub
            <IconExternalLink />
          </Link>
        </Section>

        <MdxFileView mdxFile={mdxFile.serialize()} />
      </ColumnLayout>
    </LayoutCard>
  );
};

export default TopContent;
