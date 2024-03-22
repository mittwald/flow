import Navigation, {
  NavigationItem,
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Heading from "@mittwald/flow-react-components/Heading";

<Navigation aria-label="Main navigation">
  <Heading>General</Heading>
  <NavigationGroup>
    <NavigationItem href="#">Dashboard</NavigationItem>
    <NavigationItem href="#" isCurrent>
      Performance
    </NavigationItem>
  </NavigationGroup>
  <Heading>Components</Heading>
  <NavigationGroup>
    <NavigationItem href="#">Apps</NavigationItem>
    <NavigationItem href="#">Databases</NavigationItem>
    <NavigationItem href="#">Domains</NavigationItem>
  </NavigationGroup>
</Navigation>;
