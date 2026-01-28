import type { FC } from "react";
import React from "react";
import { Heading } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { IconExternalLink } from "@mittwald/flow-react-components";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "@/app/layout.module.scss";

interface Props {
  mdxFile: MdxFile;
}

export const TopContent: FC<Props> = (props) => {
  const { mdxFile } = props;

  const component = mdxFile.mdxSource.frontmatter.component;

  return (
    <LayoutCard className={styles.topContent}>
      <ColumnLayout l={component ? [1, 1] : [1]} m={[1]}>
        <Section>
          <Heading level={1}>{mdxFile.getTitle()}</Heading>

          {mdxFile.mdxSource.frontmatter.description}

          {component && (
            <Link href={mdxFile.getGitHubUrl()}>
              GitHub
              <IconExternalLink />
            </Link>
          )}
        </Section>

        <MdxFileView mdxFile={mdxFile.serialize()} />
      </ColumnLayout>
    </LayoutCard>
  );
};

export default TopContent;
