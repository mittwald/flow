import { Navigation } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";

<Navigation aria-label="Main menu">
  <Link href="#">
    <IconCustomer />
    <Text>Organisationen</Text>
  </Link>
  <Link href="#" aria-current="page">
    <IconServer />
    <Text>Server</Text>
  </Link>
  <Link href="#">
    <IconProject />
    <Text>Projekte</Text>
  </Link>
</Navigation>;
