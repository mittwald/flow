import "@mittwald/flow-react-components/styles";
import type { ReactNode } from "react";
import styles from "../layout.module.scss";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import { ProjectNavigation } from "@/app/project/_components/ProjectNavigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className={styles.main}>
      <LayoutCard className={styles.sidebar}>
        <ProjectNavigation />
      </LayoutCard>
      <div className={styles.container}>{children}</div>
    </main>
  );
}
