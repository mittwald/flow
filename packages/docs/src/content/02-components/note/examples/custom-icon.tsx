import Note from "@mittwald/flow-next-components/Note";
import Heading from "@mittwald/flow-next-components/Heading";
import Content from "@mittwald/flow-next-components/Content";
import Icon from "@mittwald/flow-next-components/Icon";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons/faCirclePlay";

<Note>
  <Icon faIcon={faCirclePlay} aria-label="Information" />
  <Heading>Email address has been archived</Heading>
  <Content>
    As your domain has been deleted, this email address has been archived. To be
    able to send and receive emails, you must rename the address.
  </Content>
</Note>;
