import React, { type FC } from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
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

interface Props {
  mdxFile: MdxFile;
  activeTab: "overview" | "develop" | "guidelines";
}

export const TabContent: FC<Props> = (props) => {
  const { mdxFile, activeTab } = props;

  const tabContent = (
    <div className={styles.mainContent}>
      {mdxFile && <MdxFileView mdxFile={mdxFile.serialize()} />}
    </div>
  );

  const path = `/03-components/${mdxFile.slugs[0]}/${mdxFile.slugs[1]}`;

  return (
    <Flex columnGap="m">
      <LayoutCard className={styles.tabs}>
        <Tabs selectedKey={activeTab}>
          <Tab id="overview">
            <TabTitle href={`${path}/overview`}>Overview</TabTitle>
            {activeTab === "overview" && tabContent}
          </Tab>
          <Tab id="develop">
            <TabTitle href={`${path}/develop`}>Develop</TabTitle>
            {activeTab === "develop" && tabContent}
          </Tab>
          <Tab id="guidelines">
            <TabTitle href={`${path}/guidelines`}>Guidelines</TabTitle>
            {activeTab === "guidelines" && tabContent}
          </Tab>
        </Tabs>
      </LayoutCard>

      <AnchorNavigation
        currentPath={`${path}/${activeTab}`}
        anchors={mdxFile.anchors}
        title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      />
    </Flex>
  );
};

export default TabContent;
