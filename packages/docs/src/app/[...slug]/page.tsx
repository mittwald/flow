import MainContent from "@/app/_components/layout/MainContent";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@mittwald/flow-react-components/Tabs";
import { Section } from "@mittwald/flow-react-components/Section";
import React from "react";

const contentFolder = "src/content";

interface Props {
  params: StaticParams;
}

export const generateStaticParams = async (): Promise<Array<StaticParams>> => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export const generateMetadata = async (props: Props) => {
  return await MdxFileFactory.generateMetadata(contentFolder, props.params);
};

export default async function Page(props: Props) {
  const indexMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "index",
  );

  const overviewMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "overview",
  );

  const developMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "develop",
  );

  const guidelinesMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "guidelines",
  );

  return (
    <>
      {indexMdxFile && (
        <MainContent
          title={indexMdxFile.getTitle()}
          description={indexMdxFile.mdxSource.frontmatter.description}
          component={indexMdxFile.mdxSource.frontmatter.component}
        >
          <MdxFileView mdxFile={indexMdxFile.serialize()} />
        </MainContent>
      )}

      {(overviewMdxFile || developMdxFile || guidelinesMdxFile) && (
        <LayoutCard>
          <Tabs>
            <TabList>
              {overviewMdxFile && <Tab id="overview">Overview</Tab>}
              {developMdxFile && <Tab id="develop">Develop</Tab>}
              {guidelinesMdxFile && <Tab id="guidelines">Guidelines</Tab>}
            </TabList>
            {overviewMdxFile && (
              <TabPanel id="overview">
                <Section>
                  <MdxFileView mdxFile={overviewMdxFile.serialize()} />
                </Section>
              </TabPanel>
            )}
            {developMdxFile && (
              <TabPanel id="develop">
                <Section>
                  <MdxFileView mdxFile={developMdxFile.serialize()} />
                </Section>
              </TabPanel>
            )}
            {guidelinesMdxFile && (
              <TabPanel id="guidelines">
                <Section>
                  <MdxFileView mdxFile={guidelinesMdxFile.serialize()} />
                </Section>
              </TabPanel>
            )}
          </Tabs>
        </LayoutCard>
      )}
    </>
  );
}
