import { Heading, LayoutCard, Text } from "@mittwald/flow-react-components";
import type { Metadata } from "next";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import styles from "@/app/layout.module.scss";
import { ComponentsList } from "@/app/04-components/_components/ComponentsList";

const contentFolder = "src/content/04-components";

export const metadata: Metadata = {
  title: "Components",
  description: "Eine Übersicht aller Components des Flow Design Systems.",
};

export default async function Page() {
  const mdxFiles = await MdxFileFactory.fromDir(contentFolder);

  const components = mdxFiles
    .map((mdxFile) => ({
      id: mdxFile.pathname,
      name: mdxFile.getNavTitle(),
      description: mdxFile.mdxSource.frontmatter.description,
      href: `/04-components${mdxFile.pathname}/overview`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <LayoutCard className={styles.mainContent}>
      <Heading level={1}>Components</Heading>
      <Text>Eine Übersicht aller Components des Flow Design Systems.</Text>
      <ComponentsList components={components} />
    </LayoutCard>
  );
}
