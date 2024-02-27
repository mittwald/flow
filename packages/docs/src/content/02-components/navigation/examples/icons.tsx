import Navigation from "@mittwald/flow-react-components/Navigation";
import { NavigationItem } from "@mittwald/flow-react-components/Navigation";
import Icon from "@mittwald/flow-react-components/Icon";
import { Text } from "@mittwald/flow-react-components/Text";

<Navigation aria-label="Main menu">
  <NavigationItem textValue="Customer">
    <Icon name="customer" />
    <Text>Customer</Text>
  </NavigationItem>
  <NavigationItem textValue="Server" isCurrent>
    <Icon name="server" />
    <Text>Server</Text>
  </NavigationItem>
  <NavigationItem textValue="Project">
    <Icon name="project" />
    <Text>Project</Text>
  </NavigationItem>
</Navigation>;
