import MainContent from "@/app/_components/layout/MainContent";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import { StaticParams } from "@/lib/mdx/MdxFile";

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
  const mdxFile = await MdxFileFactory.fromParams(contentFolder, props.params);

  return (
    <MainContent title={mdxFile.getTitle()}>
      <MdxFileView mdxFile={mdxFile.serialize()} />
    </MainContent>
  );
}
