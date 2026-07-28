import { type FC } from "react";
import type { MdxFile, StaticParams } from "@/lib/mdx/MdxFile";
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

interface Props {
  params: StaticParams;
}

const section = "04-components";
const contentFolder = `src/content/${section}`;

// Order in which the former tabs are stacked on the single component page:
// first Guidelines, then Overview (the component's index.mdx), finally Develop.
const sectionOrder = ["guidelines", "index", "develop"] as const;

export const ComponentContent: FC<Props> = async (props) => {
  const { params } = props;

  const sectionFiles = await Promise.all(
    sectionOrder.map((name) =>
      MdxFileFactory.fromParams(contentFolder, params, name),
    ),
  );

  const orderedFiles = sectionFiles.filter(
    (file): file is MdxFile => file !== undefined,
  );

  // The component name + description live in the index file's frontmatter.
  const metaFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

  if (!metaFile) {
    return null;
  }

  const path = `/${section}/${metaFile.slugs[0]}/${metaFile.slugs[1]}`;
  const markdownUrl = rawMarkdownPath([section, ...metaFile.slugs]);
  const description = metaFile.mdxSource.frontmatter.description;

  const anchors = orderedFiles.flatMap((file) => file.anchors);

  return (
    <Flex columnGap="m" className={styles.tabsContainer}>
      <LayoutCard className={styles.tabs}>
        <div className={styles.mainContent}>
          <Section>
            <Heading level={1}>{metaFile.getTitle()}</Heading>

            {description}

            <Flex direction="row" columnGap="m">
              <Link href={metaFile.getGitHubUrl()}>
                GitHub
                <IconExternalLink />
              </Link>
              <Link href={markdownUrl} target="_blank">
                Markdown
              </Link>
            </Flex>
          </Section>

          {orderedFiles.map((file) => (
            <MdxFileView key={file.filename} mdxFile={file.serialize()} />
          ))}
        </div>
      </LayoutCard>

      <AnchorNavigation currentPath={path} anchors={anchors} />
    </Flex>
  );
};

export default ComponentContent;
