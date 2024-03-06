import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components/Icons";

<Navigation aria-label="Main menu">
  <NavigationItem textValue="Customer">
    <IconCustomer />
    <Text>Customer</Text>
  </NavigationItem>
  <NavigationItem textValue="Server" isCurrent>
    <IconServer />
    <Text>Server</Text>
  </NavigationItem>
  <NavigationItem textValue="Project">
    <IconProject />
    <Text>Project</Text>
  </NavigationItem>
</Navigation>;
