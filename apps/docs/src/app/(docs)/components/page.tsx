import { LayoutCard } from "@mittwald/flow-react-components";
import type { Metadata } from "next";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import styles from "@/app/layout.module.scss";
import PageStage from "@/app/_components/layout/PageStage";
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
    <div className={styles.pageColumn}>
      <PageStage
        eyebrow="Styleguide"
        title="Components"
        section="components"
        description="Eine Übersicht aller Components des Flow Design Systems."
      />
      <LayoutCard className={`${styles.pageCard} ${styles.mainContent}`}>
        <ComponentsOverview components={components} />
      </LayoutCard>
    </div>
  );
}
