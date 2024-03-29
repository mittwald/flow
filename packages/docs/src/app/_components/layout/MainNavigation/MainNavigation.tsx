"use client";
import React, { ComponentProps, FC, useId, useMemo } from "react";
import Navigation from "@mittwald/flow-react-components/Navigation";
import Heading from "@mittwald/flow-react-components/Heading";
import styles from "./MainNavigation.module.scss";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import {
  buildDirectoryTree,
  MdxDirectoryTree,
} from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components/Link";

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
      <Heading
        level={level as ComponentProps<typeof Heading>["level"]}
        id={headingComponentsId}
        className={styles.heading}
      >
        <GroupText>{group}</GroupText>
      </Heading>
      <Navigation aria-labelledby={headingComponentsId}>
        {navigationItems}
      </Navigation>
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
    <NavigationSection
      level={2}
      tree={selectedMainBranch}
      group={mainPathSegment}
    />
  );
};

export default MainNavigation;
