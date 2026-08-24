import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import ComponentContent from "@/app/_components/layout/ComponentContent";
import type { Metadata } from "next";

const contentFolder = "src/content/04-components";

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

  if ("slug" in params) {
    throw new Error("wrong parameter type");
  }

  return <ComponentContent params={params} />;
}
