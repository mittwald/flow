import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Heading from "@mittwald/flow-react-components/Heading";
import Link from "@mittwald/flow-react-components/Link";

<Navigation aria-label="Main navigation">
  <Heading>General</Heading>
  <NavigationGroup>
    <Link href="#">Dashboard</Link>
    <Link href="#" aria-current="page">
      Performance
    </Link>
  </NavigationGroup>
  <Heading>Components</Heading>
  <NavigationGroup>
    <Link href="#">Apps</Link>
    <Link href="#">Databases</Link>
    <Link href="#">Domains</Link>
  </NavigationGroup>
</Navigation>;
