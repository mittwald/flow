import {
  TabNavigation,
  Link,
  AlertIcon,
} from "@mittwald/flow-react-components";

<TabNavigation aria-label="Projekt-Navigation">
  <Link href="#">Apps</Link>
  <Link href="#" aria-current="page">
    Container
  </Link>
  <Link href="#">Domains</Link>
  <Link href="#">E-Mails</Link>
  <Link href="#">
    Datenbanken
    <AlertIcon status="warning" />
  </Link>
  <Link href="#">Backups</Link>
</TabNavigation>;
