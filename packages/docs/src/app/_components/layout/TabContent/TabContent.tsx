import type { FC } from "react";
import React from "react";
import { Section } from "@mittwald/flow-react-components/Section";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { Tab, TabTitle } from "@mittwald/flow-react-components/Tabs";

interface Props {
  mdxFile: MdxFile;
  tabTitle: string;
}

export const TabContent: FC<Props> = (props) => {
  const { mdxFile, tabTitle } = props;

  return (
    <Tab>
      <TabTitle>{tabTitle}</TabTitle>
      <Section>
        <MdxFileView mdxFile={mdxFile.serialize()} />
      </Section>
    </Tab>
  );
};

export default TabContent;
