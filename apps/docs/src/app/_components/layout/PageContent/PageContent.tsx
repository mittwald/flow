import type { FC, ReactNode } from "react";
import { Flex, LayoutCard } from "@mittwald/flow-react-components";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { PageActions } from "@/app/_components/layout/PageActions/PageActions";
import PageStage from "@/app/_components/layout/PageStage";
import { rawMarkdownPath } from "@/lib/llms/siteUrls";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import layoutStyles from "@/app/layout.module.scss";

interface Props {
  mdxFile: MdxFile;
  section: string;
  /** Rendered above the page body. */
  notice?: ReactNode;
}

/** "Components · Actions": the section, and the group when there is one. */
const eyebrowText = (section: string, slugs: string[]) =>
  [section, ...slugs.slice(0, slugs.length > 1 ? 1 : 0)]
    .map(extractTextFromPath)
    .join(" · ");

export const PageContent: FC<Props> = (props) => {
  const { mdxFile, section, notice } = props;

  const title = mdxFile.getTitle();

  return (
    <Flex columnGap="m" className={layoutStyles.pageContainer}>
      <div className={layoutStyles.pageColumn}>
        <PageStage
          eyebrow={eyebrowText(section, mdxFile.slugs)}
          title={title}
          description={mdxFile.mdxSource.frontmatter.description}
          section={section}
          actions={
            <PageActions
              title={title}
              markdownUrl={rawMarkdownPath([section, ...mdxFile.slugs])}
              gitHubUrl={mdxFile.getGitHubUrl()}
              color="light-static"
            />
          }
        />

        <LayoutCard className={layoutStyles.pageCard}>
          <div className={layoutStyles.mainContent}>
            {notice}
            <MdxFileView mdxFile={mdxFile.serialize()} />
          </div>
        </LayoutCard>
      </div>

      <AnchorNavigation
        currentPath={`/${section}${mdxFile.pathname}`}
        anchors={mdxFile.anchors}
      />
    </Flex>
  );
};

export default PageContent;
