import {
  TabNavigation,
  Link,
  LayoutCard,
} from "@mittwald/flow-react-components";

<LayoutCard style={{ maxWidth: "450px" }}>
  <TabNavigation aria-label="Projekt-Navigation">
    <Link href="#">Dashboard</Link>
    <Link href="#">Domains</Link>
    <Link href="#">E-Mail</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#" aria-current="page">
      Einstellungen
    </Link>
  </TabNavigation>
</LayoutCard>;
