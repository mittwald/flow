import TopContent from "@/app/_components/layout/TopContent/TopContent";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import React from "react";
import TabContent from "@/app/_components/layout/TabContent";
import type { Metadata } from "next";

const contentFolder = "src/content/03-components";

interface Props {
  params: Promise<StaticParams>;
}

export const generateStaticParams = async () => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
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

  const developMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "develop",
  );

  return (
    <>
      {indexMdxFile && <TopContent mdxFile={indexMdxFile} />}

      {developMdxFile && (
        <TabContent mdxFile={developMdxFile} activeTab="develop" />
      )}
    </>
  );
}
