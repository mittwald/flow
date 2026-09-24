import { Heading, LayoutCard, Text } from "@mittwald/flow-react-components";
import type { Metadata } from "next";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import styles from "@/app/layout.module.scss";
import { ComponentsOverview } from "@/app/components/_components/ComponentsOverview";

const contentFolder = "src/content/components";

export const metadata: Metadata = {
  title: "Components",
  description: "Eine Übersicht aller Components des Flow Design Systems.",
};

export default async function Page() {
  const mdxFiles = await MdxFileFactory.fromDir(contentFolder);

  const components = mdxFiles.map((mdxFile) => ({
    id: mdxFile.pathname,
    group: mdxFile.slugs[0] ?? "",
    slug: mdxFile.slugs[1] ?? "",
    name: mdxFile.getNavTitle(),
    component: mdxFile.mdxSource.frontmatter.component,
    description: mdxFile.mdxSource.frontmatter.description,
    href: `/components${mdxFile.pathname}`,
  }));

  return (
    <LayoutCard className={styles.mainContent}>
      <Heading level={1}>Components</Heading>
      <Text>Eine Übersicht aller Components des Flow Design Systems.</Text>
      <ComponentsOverview components={components} />
    </LayoutCard>
  );
}
