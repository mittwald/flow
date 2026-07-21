import {
  HorizontalNavigation,
  Link,
  LayoutCard,
} from "@mittwald/flow-react-components";

<LayoutCard style={{ maxWidth: "450px" }}>
  <HorizontalNavigation aria-label="Projekt-Navigation">
    <Link href="#">Dashboard</Link>
    <Link href="#">Domains</Link>
    <Link href="#">E-Mail</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#" aria-current="page">
      Einstellungen
    </Link>
  </HorizontalNavigation>
</LayoutCard>;
