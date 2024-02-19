"use client";
import React, { FC, ReactElement, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import { usePathname } from "next/navigation";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { NextJsNavigationItemLink } from "@/app/_components/layout/MainNavigation/NextJsNavigationItemLink";
import { groupBy } from "remeda";
import { GroupHeadingText } from "@/app/_components/layout/MainNavigation/components/GroupHeadingText";
import styles from "./HeaderNavigation.module.scss";

interface Props {
  docs: SerializedMdxFile[];
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const headingComponentsId = useId();
  const currentPathname = usePathname();

  const navItem = (mdx: MdxFile, group: string): ReactElement => {
    const href = mdx.pathname;

    return (
      <NavigationItem
        key={href}
        href={href}
        isCurrent={currentPathname.includes(group)}
        linkComponent={NextJsNavigationItemLink}
      >
        <GroupHeadingText>{group}</GroupHeadingText>
      </NavigationItem>
    );
  };

  return (
    <Navigation
      aria-labelledby={headingComponentsId}
      className={styles.navigation}
    >
      {Object.entries(navGroups).map(([group, mdxFiles]) =>
        navItem(mdxFiles[0], group),
      )}
    </Navigation>
  );
};

export default HeaderNavigation;
