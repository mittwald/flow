import type { FC } from "react";
import React from "react";
import { Section } from "@mittwald/flow-react-components/Section";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { Tab, TabTitle } from "@mittwald/flow-react-components/Tabs";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import * as path from "path";

interface Props {
  mdxFile: MdxFile;
  tabTitle: string;
}

export const TabContent: FC<Props> = async (props) => {
  const { mdxFile, tabTitle } = props;

  const indexFile = await MdxFileFactory.fromFile(
    "src/content/" + path.dirname(mdxFile.filename) + "/index.mdx",
  );

  return (
    <Tab>
      <TabTitle>{tabTitle}</TabTitle>
      <Section>
        <MdxFileView
          mdxFile={mdxFile.serialize()}
          indexFile={indexFile.serialize()}
        />
      </Section>
    </Tab>
  );
};

export default TabContent;
