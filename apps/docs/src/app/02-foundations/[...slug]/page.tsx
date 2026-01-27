import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import TopContent from "@/app/_components/layout/TopContent/TopContent";
import MainContent from "@/app/_components/layout/MainContent";
import type { Metadata } from "next";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import React from "react";
import { Flex } from "@mittwald/flow-react-components";

const contentFolder = "src/content/02-foundations";
export const generateStaticParams = async () => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  return await MdxFileFactory.generateMetadata(contentFolder, params);
};

interface Props {
  params: Promise<StaticParams>;
}

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

  const path = `/02-foundations/${overviewMdxFile?.slugs[0]}/${overviewMdxFile?.slugs[1]}`;

  if (!indexMdxFile) {
    throw new Error("Could not find index.mdx");
  }

  return (
    <>
      <TopContent mdxFile={indexMdxFile} />
      {overviewMdxFile && (
        <Flex columnGap="m">
          <MainContent mdxFile={overviewMdxFile} />

          <AnchorNavigation
            currentPath={`${path}`}
            anchors={overviewMdxFile.anchors}
            title={indexMdxFile.getTitle()}
          />
        </Flex>
      )}
    </>
  );
}
