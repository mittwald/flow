import Navigation from "@mittwald/flow-react-components/Navigation";
import { NavigationItem } from "@mittwald/flow-react-components/Navigation";
import Icon from "@mittwald/flow-react-components/Icon";
import { Text } from "@mittwald/flow-react-components/Text";

<Navigation aria-label="Main menu">
  <NavigationItem textValue="Customer">
    <Icon tablerIcon="customer" />
    <Text>Customer</Text>
  </NavigationItem>
  <NavigationItem textValue="Server" isCurrent>
    <Icon tablerIcon="server" />
    <Text>Customer</Text>
  </NavigationItem>
  <NavigationItem textValue="Project">
    <Icon faIcon="project" />
    <Text>Customer</Text>
  </NavigationItem>
</Navigation>;
