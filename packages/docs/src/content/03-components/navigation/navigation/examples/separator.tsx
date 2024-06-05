import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Link from "@mittwald/flow-react-components/Link";
import Label from "@mittwald/flow-react-components/Label";
import Separator from "@mittwald/flow-react-components/Separator";

<Navigation aria-label="Main navigation">
  <NavigationGroup>
    <Label>Allgemein</Label>
    <Link href="#">Dashboard</Link>
    <Link href="#" aria-current="page">
      Performance
    </Link>
  </NavigationGroup>

  <Separator />

  <NavigationGroup>
    <Label>Komponenten</Label>
    <Link href="#">Apps</Link>
    <Link href="#">Datenbanken</Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
