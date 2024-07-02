import type { FC } from "react";
import React from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { Tab, TabTitle } from "@mittwald/flow-react-components/Tabs";
import styles from "../../../layout.module.scss";

interface Props {
  mdxFile: MdxFile;
  tabTitle: string;
}

export const TabContent: FC<Props> = (props) => {
  const { mdxFile, tabTitle } = props;

  return (
    <Tab>
      <TabTitle>{tabTitle}</TabTitle>
      <div className={styles.tabContent}>
        <MdxFileView mdxFile={mdxFile.serialize()} />
      </div>
    </Tab>
  );
};

export default TabContent;
