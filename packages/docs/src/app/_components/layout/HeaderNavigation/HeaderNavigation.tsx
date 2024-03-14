"use client";
import React, { FC } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import styles from "./HeaderNavigation.module.scss";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { usePathname } from "next/navigation";

interface Props {
  docs: SerializedMdxFile[];
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const navigationItems = Object.entries(navGroups).map(([group, mdxFiles]) => (
    <NavigationItem
      href={mdxFiles[0].pathname}
      key={mdxFiles[0].pathname}
      isCurrent={currentPathname.includes(group)}
    >
      <GroupText>{group}</GroupText>
    </NavigationItem>
  ));

  return (
    <Navigation aria-label="Main navigation" className={styles.navigation}>
      {navigationItems}
    </Navigation>
  );
};

export default HeaderNavigation;
