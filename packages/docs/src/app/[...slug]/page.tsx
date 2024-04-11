import MainContent from "@/app/_components/layout/MainContent";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Tab, Tabs, TabTitle } from "@mittwald/flow-react-components/Tabs";
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
            {overviewMdxFile && (
              <Tab>
                <TabTitle>Overview</TabTitle>
                <Section>
                  <MdxFileView mdxFile={overviewMdxFile.serialize()} />
                </Section>
              </Tab>
            )}
            {developMdxFile && (
              <Tab id="develop">
                <TabTitle>Develop</TabTitle>
                <Section>
                  <MdxFileView mdxFile={developMdxFile.serialize()} />
                </Section>
              </Tab>
            )}
            {guidelinesMdxFile && (
              <Tab id="guidelines">
                <TabTitle>Guidelines</TabTitle>
                <Section>
                  <MdxFileView mdxFile={guidelinesMdxFile.serialize()} />
                </Section>
              </Tab>
            )}
          </Tabs>
        </LayoutCard>
      )}
    </>
  );
}
