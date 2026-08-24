import { type FC } from "react";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";
import {
  Flex,
  Heading,
  IconExternalLink,
  LayoutCard,
  Link,
  Section,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import { rawMarkdownPath } from "@/lib/llms/siteUrls";
import {
  ComponentStatusBadge,
  ComponentStatusCallout,
} from "@/lib/componentStatus";

interface Props {
  params: StaticParams;
}

const section = "04-components";
const contentFolder = `src/content/${section}`;

export const ComponentContent: FC<Props> = async (props) => {
  const { params } = props;

  // A component is a single index.mdx that holds the whole page (in order:
  // Guidelines, Overview, Develop); name + description live in its frontmatter.
  const mdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

  if (!mdxFile) {
    return null;
  }

  const path = `/${section}/${mdxFile.slugs[0]}/${mdxFile.slugs[1]}`;
  const markdownUrl = rawMarkdownPath([section, ...mdxFile.slugs]);
  const description = mdxFile.mdxSource.frontmatter.description;
  const component = mdxFile.mdxSource.frontmatter.component;

  return (
    <Flex columnGap="m" className={styles.tabsContainer}>
      <LayoutCard className={styles.tabs}>
        <div className={styles.mainContent}>
          <Section>
            {component && <ComponentStatusCallout name={component} />}

            <Heading level={1}>
              {mdxFile.getTitle()}
              {component && <ComponentStatusBadge name={component} />}
            </Heading>

            {description}

            <Flex direction="row" columnGap="m">
              <Link href={mdxFile.getGitHubUrl()}>
                GitHub
                <IconExternalLink />
              </Link>
              <Link href={markdownUrl} target="_blank">
                Markdown
              </Link>
            </Flex>
          </Section>

          <MdxFileView mdxFile={mdxFile.serialize()} />
        </div>
      </LayoutCard>

      <AnchorNavigation currentPath={path} anchors={mdxFile.anchors} />
    </Flex>
  );
};

export default ComponentContent;
