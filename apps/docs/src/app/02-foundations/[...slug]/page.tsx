import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import TopContent from "@/app/_components/layout/TopContent/TopContent";
import { LayoutCard } from "@mittwald/flow-react-components";
import MainContent from "@/app/_components/layout/MainContent";

const contentFolder = "src/content/02-foundations";
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

  const overviewMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "overview",
  );

  return (
    <>
      {indexMdxFile && <TopContent mdxFile={indexMdxFile} />}

      {overviewMdxFile && <MainContent mdxFile={overviewMdxFile} />}
    </>
  );
}
