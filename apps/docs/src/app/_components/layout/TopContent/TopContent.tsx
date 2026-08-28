import type { FC } from "react";
import {
  ColumnLayout,
  Flex,
  Header,
  Heading,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import { topAnchorId } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "@/app/layout.module.scss";
import { rawMarkdownPath } from "@/lib/llms/siteUrls";
import {
  ComponentStatusBadge,
  ComponentStatusCallout,
} from "@/lib/componentStatus";
import { PageActions } from "@/app/_components/layout/PageActions/PageActions";

interface Props {
  mdxFile: MdxFile;
  section: string;
}

export const TopContent: FC<Props> = (props) => {
  const { mdxFile, section } = props;

  const component = mdxFile.mdxSource.frontmatter.component;
  const markdownUrl = rawMarkdownPath([section, ...mdxFile.slugs]);

  if (!component) {
    return (
      <LayoutCard className={styles.mainContent}>
        <Flex justify="space-between" align="start">
          <Heading level={1} id={topAnchorId} className={styles.pageHeading}>
            {mdxFile.getTitle()}
          </Heading>
          <PageActions title={mdxFile.getTitle()} markdownUrl={markdownUrl} />
        </Flex>
        {mdxFile.mdxSource.frontmatter.description}
        <MdxFileView mdxFile={mdxFile.serialize()} />
      </LayoutCard>
    );
  }

  return (
    <LayoutCard className={styles.topContent}>
      <Section>
        <ComponentStatusCallout name={component} />
        <ColumnLayout l={[2, 1]} m={[1]} columnGap="l">
          <Section>
            <Header>
              <Heading
                level={1}
                id={topAnchorId}
                className={styles.pageHeading}
              >
                {mdxFile.getTitle()}
                <ComponentStatusBadge name={component} />
              </Heading>
              <PageActions
                title={mdxFile.getTitle()}
                markdownUrl={markdownUrl}
                gitHubUrl={mdxFile.getGitHubUrl()}
              />
            </Header>

            {mdxFile.mdxSource.frontmatter.description}
          </Section>

          <MdxFileView mdxFile={mdxFile.serialize()} />
        </ColumnLayout>
      </Section>
    </LayoutCard>
  );
};

export default TopContent;
