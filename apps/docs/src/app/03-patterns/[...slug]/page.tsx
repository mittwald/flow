import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import TopContent from "@/app/_components/layout/TopContent";
import type { Metadata } from "next";
import AnchorNavigation from "@/app/_components/layout/AnchorNavigation";
import React from "react";
import { Flex } from "@mittwald/flow-react-components";

const contentFolder = "src/content/03-patterns";

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

  if (!indexMdxFile) {
    throw new Error("Could not find index.mdx");
  }

  const path = `/01-get-started/${indexMdxFile.slugs[0]}`;

  return (
    <Flex columnGap="m">
      <TopContent mdxFile={indexMdxFile} />

      <AnchorNavigation
        currentPath={`${path}`}
        anchors={indexMdxFile.anchors}
        title={indexMdxFile?.getTitle()}
      />
    </Flex>
  );
}
