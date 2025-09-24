"use client";
import type { FC } from "react";
import React, { useId, useMemo, useState } from "react";
import { Navigation, NavigationGroup } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { useOverlayController } from "@mittwald/flow-react-components";
import { useOnChange } from "@mittwald/flow-react-components";
import { SearchField } from "@mittwald/flow-react-components";
import styles from "@/app/layout.module.scss";
import { LayoutCard } from "@mittwald/flow-react-components";
import { Wrap } from "@mittwald/flow-react-components";

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

  return (
    <Link
      href={
        treeItem.pathname.includes("03-components")
          ? `${treeItem.pathname}/overview`
          : treeItem.pathname
      }
      aria-current={
        currentPathname.includes(treeItem.pathname) ? "page" : undefined
      }
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
  const docsTree = useMemo(() => buildDirectoryTree(docs), [docs]);
  const currentPathname = usePathname();
  const mainPathSegment = currentPathname.split("/")[1];

  const [searchValue, setSearchValue] = useState<string>("");

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
            onChange={(value) => setSearchValue(value.toLowerCase().trim())}
          />
          <Navigation aria-labelledby={headingId}>
            {Object.entries(selectedMainBranch)
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
              )}
          </Navigation>
        </Section>
      </LayoutCard>
    </Wrap>
  );
};

export default MainNavigation;
