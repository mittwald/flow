import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";
import OffCanvas, {
  OffCanvasTrigger,
} from "@mittwald/flow-react-components/OffCanvas";
import {
  IconCustomer,
  IconMenu,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components/Icons";
import Link from "@mittwald/flow-react-components/Link";
import Navigation from "@mittwald/flow-react-components/Navigation";

<OffCanvasTrigger>
  <Button>
    <IconMenu />
  </Button>
  <OffCanvas>
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
    </Navigation>
  </OffCanvas>
</OffCanvasTrigger>;
