import TopContent from "@/app/_components/layout/TopContent/TopContent";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import React from "react";
import TabContent from "@/app/_components/layout/TabContent";

const contentFolder = "src/content/03-components";

interface Props {
  params: Promise<StaticParams>;
}

export const generateStaticParams = async () => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export default async function Page(props: Props) {
  const params = await props.params;

  const indexMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

  const guidelinesMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "guidelines",
  );

  return (
    <>
      {indexMdxFile && <TopContent mdxFile={indexMdxFile} />}

      <TabContent mdxFile={guidelinesMdxFile} activeTab="guidelines" />
    </>
  );
}
