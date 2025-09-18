import { type FC, Suspense } from "react";
import React from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { LoadingSpinner, Tab, TabTitle } from "@mittwald/flow-react-components";
import styles from "../../../layout.module.scss";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import * as path from "path";

interface Props {
  mdxFile: MdxFile;
  tabTitle?: string;
  showTabs?: boolean;
}

export const MainContent: FC<Props> = async (props) => {
  const { mdxFile, tabTitle, showTabs } = props;

  const indexFile = await MdxFileFactory.fromFile(
    "src/content/" + path.dirname(mdxFile.filename) + "/index.mdx",
  );

  const content = (
    <div className={styles.tabContent}>
      <MdxFileView
        mdxFile={mdxFile.serialize()}
        indexFile={indexFile.serialize()}
      />
    </div>
  );

  if (showTabs) {
    return (
      <Tab>
        <TabTitle>{tabTitle}</TabTitle>
        {content}
      </Tab>
    );
  }

  return <> {content} </>;
};

export default MainContent;
