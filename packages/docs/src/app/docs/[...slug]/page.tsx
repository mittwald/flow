import MainContent from "@/app/_components/layout/MainContent";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import { StaticParams } from "@/lib/mdx/MdxFile";

const docsFolder = "src/docs";

interface Props {
  params: StaticParams;
}

export const generateStaticParams = async (): Promise<Array<StaticParams>> => {
  return await MdxFileFactory.generateStaticParams(docsFolder);
};

export const generateMetadata = async (props: Props) => {
  return await MdxFileFactory.generateMetadata(docsFolder, props.params);
};

export default async function Page(props: Props) {
  const mdxFile = await MdxFileFactory.fromParams(docsFolder, props.params);

  return (
    <MainContent title={mdxFile.getTitle()}>
      <MdxFileView mdxFile={mdxFile.serialize()} />
    </MainContent>
  );
}
