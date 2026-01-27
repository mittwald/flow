"use client";
import type { FC } from "react";
import React, { useId, useState } from "react";
import {
  Heading,
  Label,
  LayoutCard,
  Link,
  Navigation,
  NavigationGroup,
  SearchField,
  Section,
  useOnChange,
  useOverlayController,
  Wrap,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.scss";

interface Props {
  docs: SerializedMdxFile[];
  mobileNavigation?: boolean;
}

interface NavigationSectionProps {
  tree: MdxDirectoryTree;
  group: string;
  searchValue: string;
}

interface NavigationLinkProps {
  treeItem: MdxFile;
}

const NavigationLink: FC<NavigationLinkProps> = (props) => {
  const { treeItem } = props;
  const currentPathname = usePathname();

  const overlay = useOverlayController("Modal");

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

const filterBySearchValue = (
  searchValue: string,
  tree: [string, MdxDirectoryTree | MdxFile],
): boolean => {
  const [, treeItem] = tree;
  if (searchValue === "" || !(treeItem instanceof MdxFile)) {
    return true;
  }
  return treeItem.getNavTitle().toLowerCase().includes(searchValue);
};

const NavigationSection: FC<NavigationSectionProps> = (props) => {
  const { tree, group, searchValue } = props;

  const navigationItems = Object.entries(tree)
    .filter((tree) => filterBySearchValue(searchValue, tree))
    .map(([group, treeItem]) =>
      treeItem instanceof MdxFile ? (
        <NavigationLink key={group} treeItem={treeItem} />
      ) : (
        <NavigationSection
          key={group}
          tree={treeItem}
          group={group}
          searchValue={searchValue}
        />
      ),
    );

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <NavigationGroup collapsable>
      <Label>
        <GroupText>{group}</GroupText>
      </Label>
      {navigationItems}
    </NavigationGroup>
  );
};

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const docsTree = buildDirectoryTree(docs);
  const currentPathname = usePathname();
  const mainPathSegment = currentPathname.split("/")[1];

  const [searchValue, setSearchValue] = useState<string>("");

  useOnChange(currentPathname, () => {
    setSearchValue("");
  });

  const headingId = useId();

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
          <Heading id={headingId}>
            <GroupText>{mainPathSegment}</GroupText>
          </Heading>

          <SearchField
            value={searchValue}
            onChange={(value) => setSearchValue(value.toLowerCase().trim())}
          />
          <Navigation aria-labelledby={headingId}>
            {Object.entries(selectedMainBranch)
              .filter((tree) => filterBySearchValue(searchValue, tree))
              .map(([group, treeItem]) =>
                treeItem instanceof MdxFile ? (
                  <NavigationLink
                    key={`${group}/${treeItem.pathname}`}
                    treeItem={treeItem}
                  />
                ) : (
                  <NavigationSection
                    key={group}
                    tree={treeItem}
                    group={group}
                    searchValue={searchValue}
                  />
                ),
              )}
          </Navigation>
        </Section>
      </LayoutCard>
    </Wrap>
  );
};

export default MainNavigation;
