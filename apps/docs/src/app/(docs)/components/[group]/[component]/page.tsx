import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import PageContent from "@/app/_components/layout/PageContent";
import type { Metadata } from "next";
import {
  ComponentStatusCallout,
  serializeDeprecationNotice,
} from "@/lib/componentStatus";

const section = "components";
const contentFolder = `src/content/${section}`;

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

  // A component is a single index.mdx that holds the whole page (in order:
  // Guidelines, Overview, Develop); name + description live in its frontmatter.
  const mdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    params,
    "index",
  );

  if (!mdxFile) {
    throw new Error("Could not find index.mdx");
  }

  const component = mdxFile.mdxSource.frontmatter.component;

  return (
    <PageContent
      mdxFile={mdxFile}
      section={section}
      notice={
        component && (
          <ComponentStatusCallout
            name={component}
            notice={await serializeDeprecationNotice(
              mdxFile.mdxSource.frontmatter.deprecationNotice,
            )}
          />
        )
      }
    />
  );
}
