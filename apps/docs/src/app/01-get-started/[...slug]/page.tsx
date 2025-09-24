import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import TopContent from "@/app/_components/layout/TopContent";

const contentFolder = "src/content/01-get-started";

export const generateStaticParams = async () => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
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

  return <TopContent mdxFile={indexMdxFile} />;
}
