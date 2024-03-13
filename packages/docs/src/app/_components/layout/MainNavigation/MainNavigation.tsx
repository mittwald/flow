"use client";
import React, { FC, Fragment, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import Heading from "@mittwald/flow-react-components/Heading";
import { usePathname } from "next/navigation";
import styles from "./MainNavigation.module.scss";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { NextJsNavigationItemLink } from "@/app/_components/layout/MainNavigation/components/NextJsNavigationItemLink";

interface Props {
  docs: SerializedMdxFile[];
}

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const headingComponentsId = useId();
  const currentPathname = usePathname();
  const currentGroupName = currentPathname.split("/")[1];
  const currentNavGroup = navGroups[currentGroupName];

  const navigationItems =
    currentNavGroup &&
    Object.entries(currentNavGroup).map(([, mdxFile]) => (
      <NavigationItem
        key={mdxFile.pathname}
        href={mdxFile.pathname}
        isCurrent={mdxFile.pathname === currentPathname}
        linkComponent={NextJsNavigationItemLink}
      >
        {mdxFile.getNavTitle()}
      </NavigationItem>
    ));

  return (
    <Fragment>
      <Heading level={4} id={headingComponentsId} className={styles.heading}>
        <GroupText>{currentGroupName}</GroupText>
      </Heading>
      <Navigation aria-labelledby={headingComponentsId}>
        {navigationItems}
      </Navigation>
    </Fragment>
  );
};

export default MainNavigation;
