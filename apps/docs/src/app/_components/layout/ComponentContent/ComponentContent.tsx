import { type FC } from "react";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { topAnchorId } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";
import {
  Flex,
  Heading,
  LayoutCard,
  Header,
  Section,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import { rawMarkdownPath } from "@/lib/llms/siteUrls";
import {
  ComponentStatusCallout,
  serializeDeprecationNotice,
} from "@/lib/componentStatus";
import { PageActions } from "@/app/_components/layout/PageActions/PageActions";

interface Props {
  params: StaticParams;
}

const section = "04-components";
const contentFolder = `src/content/${section}`;

export const ComponentContent: FC<Props> = async (props) => {
  const { params } = props;

  // A component is a single index.mdx that holds the whole page (in order:
  // Guidelines, Overview, Develop); name + description live in its frontmatter.
  const componentPages = await MdxFileFactory.fromDir(contentFolder, "index");
  const mdxFile = componentPages.find((page) =>
    page.matchesSlugs(
      "slug" in params ? params.slug : [params.group, params.component],
    ),
  );

  if (!mdxFile) {
    return null;
  }

  const path = `/${section}/${mdxFile.slugs[0]}/${mdxFile.slugs[1]}`;
  const markdownUrl = rawMarkdownPath([section, ...mdxFile.slugs]);
  const description = mdxFile.mdxSource.frontmatter.description;
  const component = mdxFile.mdxSource.frontmatter.component;
  const deprecationNotice = await serializeDeprecationNotice(
    mdxFile.mdxSource.frontmatter.deprecationNotice,
  );

  return (
    <Flex columnGap="m" className={styles.tabsContainer}>
      <LayoutCard className={styles.tabs}>
        <div className={styles.mainContent}>
          <Section>
            <Header>
              <Heading
                level={1}
                id={topAnchorId}
                className={styles.pageHeading}
              >
                {mdxFile.getTitle()}
              </Heading>
              <PageActions
                title={mdxFile.getTitle()}
                markdownUrl={markdownUrl}
                gitHubUrl={mdxFile.getGitHubUrl()}
              />
            </Header>

            {description}

            {component && (
              <ComponentStatusCallout
                name={component}
                notice={deprecationNotice}
              />
            )}
          </Section>

          <MdxFileView mdxFile={mdxFile.serialize()} />
        </div>
      </LayoutCard>

      <AnchorNavigation currentPath={path} anchors={mdxFile.anchors} />
    </Flex>
  );
};

export default ComponentContent;
