import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Link from "@mittwald/flow-react-components/Link";
import Label from "@mittwald/flow-react-components/Label";

<Navigation aria-label="Main navigation">
  <Label>General</Label>
  <NavigationGroup>
    <Link href="#">Dashboard</Link>
    <Link href="#" aria-current="page">
      Performance
    </Link>
  </NavigationGroup>
  <Label>Components</Label>
  <NavigationGroup>
    <Link href="#">Apps</Link>
    <Link href="#">Databases</Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
