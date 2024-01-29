"use client";
import React, { FC, ReactElement, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-next-components/Navigation";
import Heading from "@mittwald/flow-next-components/Heading";
import { usePathname } from "next/navigation";
import styles from "./MainNavigation.module.scss";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { NextJsNavigationItemLink } from "@/app/_components/layout/MainNavigation/NextJsNavigationItemLink";

interface Props {
  docs: SerializedMdxFile[];
}

const MainNavigation: FC<Props> = (props) => {
  const { docs } = props;

  const headingComponentsId = useId();
  const currentPathname = usePathname();

  const navItem = (mdx: MdxFile): ReactElement => {
    const href = `/docs/${mdx.pathname}`;
    return (
      <NavigationItem
        key={mdx.pathname}
        href={href}
        isCurrent={href === currentPathname}
        linkComponent={NextJsNavigationItemLink}
      >
        {mdx.getNavTitle()}
      </NavigationItem>
    );
  };

  return (
    <>
      <Heading level={3} id={headingComponentsId} className={styles.heading}>
        Components
      </Heading>
      <Navigation aria-labelledby={headingComponentsId}>
        {docs.map(MdxFile.deserialize).map(navItem)}
      </Navigation>
    </>
  );
};

export default MainNavigation;
