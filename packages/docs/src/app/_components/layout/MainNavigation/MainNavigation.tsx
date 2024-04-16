"use client";
import type { ComponentProps, FC } from "react";
import React, { useId, useMemo } from "react";
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

interface Props {
  docs: SerializedMdxFile[];
}

interface NavigationSectionProps {
  level: number;
  tree: MdxDirectoryTree;
  group: string;
}

const NavigationSection: FC<NavigationSectionProps> = (props) => {
  const { level, tree, group } = props;
  const headingComponentsId = useId();
  const currentPathname = usePathname();

  const navigationItems = Object.entries(tree).map(([group, treeItem]) =>
    treeItem instanceof MdxFile ? (
      <Link
        key={group}
        href={treeItem.pathname}
        aria-current={
          treeItem.pathname === currentPathname ? "page" : undefined
        }
      >
        {treeItem.getNavTitle()}
      </Link>
    ) : (
      <NavigationSection
        key={group}
        tree={treeItem}
        level={level + 1}
        group={group}
      />
    ),
  );

  return (
    <>
      {level >= 4 ? (
        <Label>
          <GroupText>{group}</GroupText>
        </Label>
      ) : (
        <Heading
          level={level as ComponentProps<typeof Heading>["level"]}
          id={headingComponentsId}
        >
          <GroupText>{group}</GroupText>
        </Heading>
      )}

      <NavigationGroup aria-labelledby={headingComponentsId}>
        {navigationItems}
      </NavigationGroup>
    </>
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
    <Navigation>
      <NavigationSection
        level={3}
        tree={selectedMainBranch}
        group={mainPathSegment}
      />
    </Navigation>
  );
};

export default MainNavigation;
