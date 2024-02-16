import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";
import Icon from "@mittwald/flow-react-components/Icon";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons/faCirclePlay";

<InlineAlert>
  <Icon faIcon={faCirclePlay} aria-label="Information" />
  <Heading>Email address has been archived</Heading>
  <Content>
    As your domain has been deleted, this email address has
    been archived. To be able to send and receive emails,
    you must rename the address.
  </Content>
</InlineAlert>;
