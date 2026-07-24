"use client";
import {
  AlertIcon,
  TabNavigation,
  Link,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <TabNavigation aria-label="Project navigation">
      <Link href="#">Apps</Link>
      <Link href="#" aria-current="page">
        Container
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">E-Mails</Link>
      <Link href="#">
        Databases
        <AlertIcon status="warning" />
      </Link>
      <Link href="#">Backups</Link>
    </TabNavigation>
  );
}
