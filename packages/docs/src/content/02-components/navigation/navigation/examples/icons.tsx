import Navigation from "@mittwald/flow-react-components/Navigation";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components/Icons";
import { Link } from "@mittwald/flow-react-components/Link";

<Navigation aria-label="Main menu">
  <Link>
    <IconCustomer />
    <Text>Customer</Text>
  </Link>
  <Link aria-current="page">
    <IconServer />
    <Text>Server</Text>
  </Link>
  <Link>
    <IconProject />
    <Text>Project</Text>
  </Link>
</Navigation>;
