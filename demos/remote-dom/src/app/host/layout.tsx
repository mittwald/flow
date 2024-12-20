import "@mittwald/flow-react-components/all.css";
import "@mittwald/flow-remote-react-renderer/polyfill";
import type { PropsWithChildren } from "react";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";
import { Link } from "@mittwald/flow-react-components/Link";
import styles from "./layout.module.css";
import { Separator } from "@mittwald/flow-react-components/Separator";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className={styles.rootContainer}>
      <HeaderNavigation>
        <Link href="/host/non-interactive">Non-interactive</Link>
        <Link href="/host/event-handler">Event handler</Link>
        <Link href="/host/modal">Modal</Link>
        <Link href="/host/simple-form">Simple Form</Link>
        <Link href="/host/action-form">Action Form</Link>
        <Link href="/host/rhf-form">RHF Form</Link>
        <Link href="/host/suspense">Suspense</Link>
        <Link href="/host/svg">Icon/SVG</Link>
        <Link href="/host/list">List</Link>
        <Link href="/host/performance">Performance</Link>
      </HeaderNavigation>
      <Separator />
      <main className={styles.mainContainer}>
        <div>{props.children}</div>
      </main>
    </div>
  );
}
