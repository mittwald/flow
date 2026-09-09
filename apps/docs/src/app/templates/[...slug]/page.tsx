import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import PageContent from "@/app/_components/layout/PageContent";
import type { Metadata } from "next";

const section = "templates";
const contentFolder = `src/content/${section}`;

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

  const mdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

  if (!mdxFile) {
    throw new Error("Could not find index.mdx");
  }

  return <PageContent mdxFile={mdxFile} section={section} />;
}
