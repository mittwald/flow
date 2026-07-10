import {
  HorizontalNavigation,
  Link,
} from "@mittwald/flow-react-components";

<div style={{ width: "320px" }}>
  <HorizontalNavigation aria-label="Projekt-Navigation">
    <Link href="#">Dashboard</Link>
    <Link href="#">Domains</Link>
    <Link href="#">E-Mail</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#" aria-current="page">
      Einstellungen
    </Link>
  </HorizontalNavigation>
</div>;
