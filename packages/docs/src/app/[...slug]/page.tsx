import TopContent from "@/app/_components/layout/TopContent/TopContent";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Tabs } from "@mittwald/flow-react-components/Tabs";
import React from "react";
import MainContent from "@/app/_components/layout/MainContent/MainContent";
import { Link } from "@mittwald/flow-react-components/Link";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";

const contentFolder = "src/content";

interface Props {
  params: Promise<StaticParams>;
}

export const generateStaticParams = async (): Promise<StaticParams[]> => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  return await MdxFileFactory.generateMetadata(contentFolder, params);
};

export default async function Page(props: Props) {
  const params = await props.params;

  const indexMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

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

  const component = indexMdxFile?.mdxSource.frontmatter.component;
  const showTabs = !!developMdxFile || !!guidelinesMdxFile;

  return (
    <>
      {indexMdxFile && <TopContent mdxFile={indexMdxFile} />}

      {!showTabs && overviewMdxFile && (
        <LayoutCard>
          <MainContent mdxFile={overviewMdxFile} />
        </LayoutCard>
      )}
      {overviewMdxFile && showTabs && (
        <LayoutCard>
          <Tabs>
            {overviewMdxFile && (
              <MainContent mdxFile={overviewMdxFile} tabTitle="Overview" />
            )}
            {developMdxFile && (
              <MainContent mdxFile={developMdxFile} tabTitle="Develop" />
            )}
            {guidelinesMdxFile && (
              <MainContent mdxFile={guidelinesMdxFile} tabTitle="Guidelines" />
            )}
          </Tabs>
        </LayoutCard>
      )}
      {component && (
        <Link
          href={`https://github.com/mittwald/flow/issues/new?title=Feedback%20on%20${component}%20component`}
        >
          Feedback geben <IconExternalLink />
        </Link>
      )}
    </>
  );
}
