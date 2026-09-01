import {
  Label,
  Link,
  Navigation,
  NavigationGroup,
} from "@mittwald/flow-react-components";

<Navigation aria-label="Main navigation">
  <NavigationGroup collapsable defaultExpanded={false}>
    <Label>Allgemein</Label>
    <Link href="#">Dashboard</Link>
    <Link href="#">Performance</Link>
  </NavigationGroup>
  <NavigationGroup collapsable>
    <Label>Components</Label>
    <Link href="#">Apps</Link>
    <Link href="#" aria-current="page">
      Datenbanken
    </Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
