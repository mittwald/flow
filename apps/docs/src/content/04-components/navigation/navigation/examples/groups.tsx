import {
  Label,
  Link,
  Navigation,
  NavigationGroup,
} from "@mittwald/flow-react-components";

<Navigation aria-label="Main navigation">
  <NavigationGroup>
    <Label>Allgemein</Label>
    <Link href="#">Dashboard</Link>
    <Link href="#" aria-current="page">
      Performance
    </Link>
  </NavigationGroup>
  <NavigationGroup>
    <Label>Komponenten</Label>
    <Link href="#">Apps</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
