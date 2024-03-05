"use client";
import React, { FC, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import styles from "./HeaderNavigation.module.scss";
import { NextJsNavigationItemLink } from "@/app/_components/layout/MainNavigation/NextJsNavigationItemLink";
import { GroupHeadingText } from "@/app/_components/layout/MainNavigation/components/GroupHeadingText";
import { usePathname } from "next/navigation";

interface Props {
  docs: SerializedMdxFile[];
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const headingComponentsId = useId();
  const currentPathname = usePathname();

  const navigationItems = Object.entries(navGroups).map(([group, mdxFiles]) => (
    <NavigationItem
      href={mdxFiles[0].pathname}
      key={mdxFiles[0].pathname}
      isCurrent={currentPathname.includes(group)}
      linkComponent={NextJsNavigationItemLink}
      textValue={group}
    >
      <GroupHeadingText>{group}</GroupHeadingText>
    </NavigationItem>
  ));

  return (
    <Navigation
      aria-labelledby={headingComponentsId}
      className={styles.navigation}
    >
      {navigationItems}
    </Navigation>
  );
};

export default HeaderNavigation;
