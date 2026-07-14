"use client";
import type { FC } from "react";
import { useMemo } from "react";
import {
  Label,
  LayoutCard,
  Link,
  Navigation,
  NavigationGroup,
  Section,
  useModalController,
  useOnChange,
  Wrap,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.scss";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";

interface Props {
  docs: SerializedMdxFile[];
  mobileNavigation?: boolean;
}

interface NavigationSectionProps {
  tree: MdxDirectoryTree;
  group: string;
}

interface NavigationLinkProps {
  treeItem: MdxFile;
}

const NavigationLink: FC<NavigationLinkProps> = (props) => {
  const { treeItem } = props;
  const currentPathname = usePathname();

  const overlay = useModalController();

  useOnChange(currentPathname, () => {
    overlay.close();
  }, [overlay]);

  const pathname = treeItem.pathname;
  const isComponent = pathname.includes("04-components");
  const lastSlashIndex = currentPathname.lastIndexOf("/");
  const currentPage = isComponent
    ? currentPathname.substring(0, lastSlashIndex)
    : currentPathname;

  return (
    <Link
      href={`${pathname}${isComponent ? "/overview" : ""}`}
      aria-current={pathname === currentPage ? "page" : undefined}
    >
      {treeItem.getNavTitle()}
    </Link>
  );
};

const NavigationSection: FC<NavigationSectionProps> = (props) => {
  const { tree, group } = props;

  return (
    <NavigationGroup collapsable>
      <Label>
        <GroupText>{group}</GroupText>
      </Label>
      {Object.entries(tree).map(([group, treeItem]) =>
        treeItem instanceof MdxFile ? (
          <NavigationLink key={group} treeItem={treeItem} />
        ) : (
          <NavigationSection key={group} tree={treeItem} group={group} />
        ),
      )}
    </NavigationGroup>
  );
};

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const docsTree = useMemo(() => buildDirectoryTree(docs), [docs]);
  const currentPathname = usePathname();
  const mainPathSegment = currentPathname.split("/")[1];

  if (mainPathSegment === undefined) {
    return null;
  }

  const selectedMainBranch = docsTree[mainPathSegment];
  if (!selectedMainBranch || selectedMainBranch instanceof MdxFile) {
    return null;
  }

  return (
    <Wrap if={!props.mobileNavigation}>
      <LayoutCard className={styles.mainNavigation}>
        <Section>
          <Navigation
            aria-label={extractTextFromPath(mainPathSegment)}
            key={mainPathSegment}
          >
            {Object.entries(selectedMainBranch).map(([group, treeItem]) =>
              treeItem instanceof MdxFile ? (
                <NavigationLink key={treeItem.pathname} treeItem={treeItem} />
              ) : (
                <NavigationSection key={group} tree={treeItem} group={group} />
              ),
            )}
          </Navigation>
        </Section>
      </LayoutCard>
    </Wrap>
  );
};

export default MainNavigation;
