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

  const hasSubGroups = currentPathname.split("/").length >= 4;

  const navSubGroups = hasSubGroups
    ? groupBy(currentNavGroup, (d) => d.pathname.split("/")[2])
    : undefined;

  const navigationItems = (mdx: MdxFile[]) =>
    Object.entries(mdx).map(([, mdxFile]) => (
      <NavigationItem
        key={mdxFile.pathname}
        href={mdxFile.pathname}
        isCurrent={mdxFile.pathname === currentPathname}
      >
        {mdxFile.getNavTitle()}
      </NavigationItem>
    ));

  const navigation = navSubGroups ? (
    Object.entries(navSubGroups).map(([group, mdxFiles]) => (
      <Fragment key={group}>
        <Heading level={3} id={headingComponentsId} className={styles.heading}>
          <GroupText>{group}</GroupText>
        </Heading>
        <Navigation aria-labelledby={headingComponentsId}>
          {navigationItems(mdxFiles)}
        </Navigation>
      </Fragment>
    ))
  ) : (
    <Navigation aria-labelledby={headingComponentsId}>
      {navigationItems(currentNavGroup)}
    </Navigation>
  );

  return (
    <Fragment>
      <Heading level={2} id={headingComponentsId} className={styles.heading}>
        <GroupText>{currentGroupName}</GroupText>
      </Heading>
      {navigation}
    </Fragment>
  );
};

export default MainNavigation;
