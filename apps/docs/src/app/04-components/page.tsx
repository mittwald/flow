import {
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { Metadata } from "next";
import { groupBy } from "remeda";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import styles from "@/app/layout.module.scss";
import { ComponentsList } from "@/app/04-components/_components/ComponentsList";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";

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
      group: mdxFile.slugs[0] ?? "",
      slug: mdxFile.slugs[1] ?? "",
      name: mdxFile.getNavTitle(),
      description: mdxFile.mdxSource.frontmatter.description,
      href: `/04-components${mdxFile.pathname}/overview`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const groups = Object.entries(groupBy(components, (c) => c.group)).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  return (
    <LayoutCard className={styles.mainContent}>
      <Heading level={1}>Components</Heading>
      <Text>Eine Übersicht aller Components des Flow Design Systems.</Text>
      {groups.map(([group, groupComponents]) => (
        <Section key={group}>
          <Heading>{extractTextFromPath(group)}</Heading>
          <ComponentsList components={groupComponents} />
        </Section>
      ))}
    </LayoutCard>
  );
}
