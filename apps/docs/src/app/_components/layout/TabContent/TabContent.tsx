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
  Link,
  Navigation,
} from "@mittwald/flow-react-components";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";

interface Props {
  mdxFile?: MdxFile;
  activeTab: "overview" | "develop" | "guidelines";
}

export const TabContent: FC<Props> = (props) => {
  const { mdxFile, activeTab } = props;

  const tabContent = (
    <div className={styles.mainContent}>
      {mdxFile && <MdxFileView mdxFile={mdxFile.serialize()} />}
    </div>
  );

  return (
    <Flex columnGap="m">
      <LayoutCard>
        <Tabs selectedKey={activeTab}>
          <Tab id="overview">
            <TabTitle href="/03-components/actions/action-group/overview">
              Overview
            </TabTitle>
            {activeTab === "overview" && tabContent}
          </Tab>
          <Tab id="develop">
            <TabTitle href="/03-components/actions/action-group/develop">
              Develop
            </TabTitle>
            {activeTab === "develop" && tabContent}
          </Tab>
          <Tab id="guidelines">
            <TabTitle href="/03-components/actions/action-group/guidelines">
              Guidelines
            </TabTitle>
            {activeTab === "guidelines" && tabContent}
          </Tab>
        </Tabs>
      </LayoutCard>
      {mdxFile?.anchors && (
        <AnchorNavigation
          anchors={mdxFile.anchors}
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />
      )}
    </Flex>
  );
};

export default TabContent;
