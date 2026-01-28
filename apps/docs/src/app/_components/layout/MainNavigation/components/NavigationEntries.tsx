"use client";
import React, { type FC } from "react";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { filterBySearchValue } from "@/app/_components/layout/MainNavigation/MainNavigation";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import {
  Label,
  Link,
  NavigationGroup,
  useOnChange,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { usePathname } from "next/navigation";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";

interface NavigationEntriesProps {
  branch: MdxDirectoryTree;
  searchValue: string;
}

export const NavigationEntries: FC<NavigationEntriesProps> = (props) => {
  const { branch, searchValue } = props;

  console.log(branch, "");

  return Object.entries(branch)
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
    );
};

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

interface NavigationSectionProps {
  tree: MdxDirectoryTree;
  group: string;
  searchValue: string;
}

const NavigationSection: FC<NavigationSectionProps> = (props) => {
  const { tree, group, searchValue } = props;

  const navigationItems = Object.entries(tree)
    .filter((tree) => filterBySearchValue(searchValue, tree))
    .map(([group, treeItem]) =>
      treeItem instanceof MdxFile ? (
        <NavigationLink
          key={`${group}/${treeItem.pathname}`}
          treeItem={treeItem}
        />
      ) : null,
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
