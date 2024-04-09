import Navigation from "@mittwald/flow-react-components/Navigation";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components/Icons";
import { Link } from "@mittwald/flow-react-components/Link";

<Navigation aria-label="Main menu">
  <Link href="#">
    <IconCustomer />
    <Text>Customer</Text>
  </Link>
  <Link href="#" aria-current="page">
    <IconServer />
    <Text>Server</Text>
  </Link>
  <Link href="#">
    <IconProject />
    <Text>Project</Text>
  </Link>
</Navigation>;
