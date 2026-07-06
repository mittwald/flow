"use client";
import { type FC } from "react";
import styles from "./Header.module.scss";
import {
  Link,
  useModalController,
  HeaderNavigation,
  Flex,
} from "@mittwald/flow-react-components";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileNavigation from "@/app/_components/layout/MobileNavigation";
import { FlowLogo } from "@/app/_components/layout/Header/FlowLogo";
import {
  SearchButton,
  SearchDialog,
} from "@/app/_components/layout/DocsSearch";
import Groups from "@/app/_components/layout/Groups";
import { ThemeSwitcherButton } from "@/app/_components/layout/Header/components/ThemeSwitcherButton";

interface Props {
  docs: SerializedMdxFile[];
}

const Header: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const searchController = useModalController();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Flex align="center" gap="l">
          <Link href="/" aria-label="Flow">
            <FlowLogo className={styles.logo} />
          </Link>
          <HeaderNavigation
            className={styles.headerNavigation}
            aria-label="Header Navigation"
          >
            <Groups docs={docs.map((mdx) => mdx.serialize())} />
          </HeaderNavigation>
        </Flex>
        <Flex gap="m">
          <SearchButton controller={searchController} />
          <ThemeSwitcherButton />
        </Flex>
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
