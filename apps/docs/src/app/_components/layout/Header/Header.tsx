"use client";
import { type FC, useEffect, useState } from "react";
import styles from "../../../layout.module.scss";
import { Image, Link } from "@mittwald/flow-react-components";
import logoMittwald from "../../../../../assets/flow-logo.svg";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileNavigation from "@/app/_components/layout/MobileNavigation";
import clsx from "clsx";

interface Props {
  docs: SerializedMdxFile[];
}

const Header: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={clsx(styles.header, hasScrolled && styles.scrolled)}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image
            className={styles.logo}
            src={logoMittwald.src}
            alt="mittwald Flow Logo"
          />
        </Link>
        <HeaderNavigation
          className={styles.headerNavigation}
          docs={docs.map((mdx) => mdx.serialize())}
        />
        <MobileNavigation
          docs={docs.map((mdx) => mdx.serialize())}
          className={styles.mobileNavigation}
        />
      </div>
    </header>
  );
};

export default Header;
