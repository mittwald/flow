import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";
import OffCanvas from "@mittwald/flow-react-components/OffCanvas";
import {
  IconCustomer,
  IconMenu,
  IconProject,
  IconServer,
} from "@mittwald/flow-react-components/Icons";
import Link from "@mittwald/flow-react-components/Link";
import Navigation from "@mittwald/flow-react-components/Navigation";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Section } from "@mittwald/flow-react-components/Section";
import { OverlayTrigger } from "@mittwald/flow-react-components/OverlayTrigger";

<OverlayTrigger>
  <Button>
    <IconMenu />
  </Button>
  <OffCanvas>
    <Section>
      <Heading>Menü</Heading>
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
    </Section>
  </OffCanvas>
</OverlayTrigger>;
