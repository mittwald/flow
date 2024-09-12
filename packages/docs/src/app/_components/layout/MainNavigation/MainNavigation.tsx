"use client";
import type { FC } from "react";
import React, { useId, useMemo, useState } from "react";
import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Heading from "@mittwald/flow-react-components/Heading";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components/Link";
import { Label } from "@mittwald/flow-react-components/Label";
import { Section } from "@mittwald/flow-react-components/Section";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import { useOnChange } from "@mittwald/flow-react-components/hooks";
import { SearchField } from "@mittwald/flow-react-components/SearchField";

interface Props {
  docs: SerializedMdxFile[];
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
      href={treeItem.pathname}
      aria-current={treeItem.pathname === currentPathname ? "page" : undefined}
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
  );
};

export default MainNavigation;
