import type { FC } from "react";
import styles from "../../../layout.module.scss";
import { LayoutCard, Link, Image } from "@mittwald/flow-react-components";
import logoMittwald from "../../../../../assets/flow-logo.svg";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileNavigation from "@/app/_components/layout/MobileNavigation";

interface Props {
  docs: SerializedMdxFile[];
}

const Header: FC<Props> = async (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  return (
    <header className={styles.header}>
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
