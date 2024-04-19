import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Link from "@mittwald/flow-react-components/Link";
import Label from "@mittwald/flow-react-components/Label";

<Navigation aria-label="Main navigation">
  <Label>Allgemein</Label>
  <NavigationGroup>
    <Link href="#">Dashboard</Link>
    <Link href="#" aria-current="page">
      Performance
    </Link>
  </NavigationGroup>
  <Label>Komponenten</Label>
  <NavigationGroup>
    <Link href="#">Apps</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
