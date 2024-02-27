import Navigation, {
  NavigationItem,
} from "@mittwald/flow-react-components/Navigation";
import Icon from "@mittwald/flow-react-components/Icon";
import { Text } from "@mittwald/flow-react-components/Text";
import { faUser } from "@fortawesome/free-regular-svg-icons/faUser";
import { faHardDrive } from "@fortawesome/free-regular-svg-icons/faHardDrive";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";

<Navigation aria-label="Main menu">
  <NavigationItem textValue="Address">
    <Icon faIcon={faStar} />
    <Text>Address</Text>
  </NavigationItem>
  <NavigationItem textValue="Profile" isCurrent>
    <Icon faIcon={faUser} />
    <Text>Profile</Text>
  </NavigationItem>
  <NavigationItem textValue="Storage">
    <Icon faIcon={faHardDrive} />
    <Text>Storage</Text>
  </NavigationItem>
</Navigation>;
