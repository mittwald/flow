"use client";
import { type FC } from "react";
import styles from "./Header.module.scss";
import { Link, useModalController } from "@mittwald/flow-react-components";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileNavigation from "@/app/_components/layout/MobileNavigation";
import { FlowLogo } from "@/app/_components/layout/Header/FlowLogo";
import { SearchDialog } from "@/app/_components/layout/DocsSearch";

interface Props {
  docs: SerializedMdxFile[];
}

const Header: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const searchController = useModalController();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" aria-label="Flow">
          <FlowLogo className={styles.logo} />
        </Link>
        <HeaderNavigation
          className={styles.headerNavigation}
          docs={docs.map((mdx) => mdx.serialize())}
          searchController={searchController}
        />
        <MobileNavigation
          docs={docs.map((mdx) => mdx.serialize())}
          className={styles.mobileNavigation}
          searchController={searchController}
        />
      </div>
      <SearchDialog controller={searchController} />
    </header>
  );
};

export default Header;
