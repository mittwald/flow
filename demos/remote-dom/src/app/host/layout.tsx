import "@mittwald/flow-remote-react-renderer/polyfill";
import type { PropsWithChildren } from "react";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";
import { Link } from "@mittwald/flow-react-components/nextjs";
import { Heading } from "@mittwald/flow-react-components/Heading";
import styles from "./layout.module.css";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className={styles.rootContainer}>
      <HeaderNavigation>
        <Link href="#">Simple</Link>
      </HeaderNavigation>
      <main className={styles.mainContainer}>
        <Heading>Flow Remote DOM Demo</Heading>
        <div>{props.children}</div>
      </main>
    </div>
  );
}
