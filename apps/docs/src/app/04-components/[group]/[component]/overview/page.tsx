import { redirect } from "next/navigation";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";

const contentFolder = "src/content/04-components";

interface Props {
  params: Promise<StaticParams>;
}

export const generateStaticParams = async () => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

// The former tabs are consolidated onto the component's base page. The tab
// routes are kept as redirects so existing links (and their URL fragments)
// keep working.
export default async function Page(props: Props) {
  const params = await props.params;

  if ("slug" in params) {
    throw new Error("wrong parameter type");
  }

  redirect(`/04-components/${params.group}/${params.component}`);
}
