import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import TopContent from "@/app/_components/layout/TopContent";
import type { Metadata } from "next";
import Footer from "@/app/_components/layout/Footer";

const contentFolder = "src/content/01-get-started";

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

  return (
    <>
      <TopContent mdxFile={indexMdxFile} />
      <Footer />
    </>
  );
}
