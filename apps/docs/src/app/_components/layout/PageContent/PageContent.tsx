import type { FC, ReactNode } from "react";
import {
  Flex,
  Header,
  Heading,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { PageActions } from "@/app/_components/layout/PageActions/PageActions";
import { rawMarkdownPath } from "@/lib/llms/siteUrls";
import styles from "@/app/layout.module.scss";

interface Props {
  mdxFile: MdxFile;
  section: string;
  /** Rendered between the description and the page body. */
  notice?: ReactNode;
}

export const PageContent: FC<Props> = (props) => {
  const { mdxFile, section, notice } = props;

  const title = mdxFile.getTitle();

  return (
    <Flex columnGap="m" className={styles.pageContainer}>
      <LayoutCard className={styles.pageCard}>
        <div className={styles.mainContent}>
          <Section>
            <Header>
              <Heading level={1}>{title}</Heading>
              <PageActions
                title={title}
                markdownUrl={rawMarkdownPath([section, ...mdxFile.slugs])}
                gitHubUrl={mdxFile.getGitHubUrl()}
              />
            </Header>

            {mdxFile.mdxSource.frontmatter.description}

            {notice}
          </Section>

          <MdxFileView mdxFile={mdxFile.serialize()} />
        </div>
      </LayoutCard>

      <AnchorNavigation
        currentPath={`/${section}${mdxFile.pathname}`}
        anchors={mdxFile.anchors}
      />
    </Flex>
  );
};

export default PageContent;
