import React, { type FC } from "react";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";
import {
  Flex,
  LayoutCard,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";

interface Props {
  activeTab: "overview" | "develop" | "guidelines";
  params: StaticParams;
}

const contentFolder = "src/content/03-components";

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

  const path = `/03-components/${currentMdxFile.slugs[0]}/${currentMdxFile.slugs[1]}`;

  return (
    <Flex columnGap="m" className={styles.tabsContainer}>
      <Flex direction="column" rowGap="m" className={styles.tabsContainer}>
        <LayoutCard className={styles.tabs}>
          <Tabs selectedKey={activeTab}>
            {overviewMdxFile && (
              <Tab id="overview">
                <TabTitle href={`${path}/overview`}>Overview</TabTitle>
                {activeTab === "overview" && tabContent}
              </Tab>
            )}
            {developMdxFile && (
              <Tab id="develop">
                <TabTitle href={`${path}/develop`}>Develop</TabTitle>
                {activeTab === "develop" && tabContent}
              </Tab>
            )}
            {guidelinesMdxFile && (
              <Tab id="guidelines">
                <TabTitle href={`${path}/guidelines`}>Guidelines</TabTitle>
                {activeTab === "guidelines" && tabContent}
              </Tab>
            )}
          </Tabs>
        </LayoutCard>
      </Flex>

      <AnchorNavigation
        currentPath={`${path}/${activeTab}`}
        anchors={currentMdxFile.anchors}
        title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      />
    </Flex>
  );
};

export default TabContent;
