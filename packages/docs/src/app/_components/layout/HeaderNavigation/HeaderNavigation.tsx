"use client";
import type { FC } from "react";
import React from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components/Link";
import styles from "@/app/layout.module.scss";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import { IconMenu } from "@mittwald/flow-react-components/Icons";
import {
  OffCanvas,
  OffCanvasTrigger,
} from "@mittwald/flow-react-components/OffCanvas";
import { Button } from "@mittwald/flow-react-components/Button";

interface Props {
  docs: SerializedMdxFile[];
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const navigationItems = Object.entries(navGroups).map(([group, mdxFiles]) => (
    <Link
      href={mdxFiles[0].pathname}
      key={mdxFiles[0].pathname}
      aria-current={currentPathname.includes(group) ? "page" : undefined}
    >
      <GroupText>{group}</GroupText>
    </Link>
  ));

  return (
    <HeaderNavigationComponent aria-label="Header navigation">
      {navigationItems}
      <div className={styles.navMobile}>
        <OffCanvasTrigger>
          <Button>
            <IconMenu />
          </Button>
          <OffCanvas>
            <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
          </OffCanvas>
        </OffCanvasTrigger>
      </div>
    </HeaderNavigationComponent>
  );
};

export default HeaderNavigation;
