import React, { type FC } from "react";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";
import {
  Flex,
  HorizontalNavigation,
  LayoutCard,
  Link,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";

interface Props {
  activeTab: "overview" | "develop" | "guidelines";
  params: StaticParams;
}

const contentFolder = "src/content/04-components";

export const TabContent: FC<Props> = async (props) => {
  const { activeTab, params } = props;

  const overviewMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "overview",
  );

  const developMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "develop",
  );

  const guidelinesMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "guidelines",
  );

  const currentMdxFile =
    activeTab === "overview"
      ? overviewMdxFile
      : activeTab === "develop"
        ? developMdxFile
        : guidelinesMdxFile;

  if (!currentMdxFile) {
    return null;
  }

  const tabContent = (
    <div className={styles.mainContent}>
      <MdxFileView mdxFile={currentMdxFile.serialize()} />
    </div>
  );

  const path = `/04-components/${currentMdxFile.slugs[0]}/${currentMdxFile.slugs[1]}`;

  return (
    <Flex columnGap="m" className={styles.tabsContainer}>
      <Flex direction="column" rowGap="m" className={styles.tabsContainer}>
        <LayoutCard className={styles.tabs}>
          <HorizontalNavigation aria-label="Bereiche">
            {overviewMdxFile && (
              <Link
                href={`${path}/overview`}
                aria-current={activeTab === "overview" ? "page" : undefined}
              >
                Overview
              </Link>
            )}
            {developMdxFile && (
              <Link
                href={`${path}/develop`}
                aria-current={activeTab === "develop" ? "page" : undefined}
              >
                Develop
              </Link>
            )}
            {guidelinesMdxFile && (
              <Link
                href={`${path}/guidelines`}
                aria-current={activeTab === "guidelines" ? "page" : undefined}
              >
                Guidelines
              </Link>
            )}
          </HorizontalNavigation>
          {tabContent}
        </LayoutCard>
      </Flex>

      <AnchorNavigation
        currentPath={`${path}/${activeTab}`}
        anchors={currentMdxFile.anchors}
      />
    </Flex>
  );
};

export default TabContent;
