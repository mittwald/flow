import Note from "@mittwald/flow-react-components/Note";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";

<Row>
  <Note variant="info">
    <Heading>Email address has been archived</Heading>
    <Content>
      As your domain has been deleted, this email address
      has been archived. To be able to send and receive
      emails, you must rename the address.
    </Content>
  </Note>

  <Note variant="warning">
    <Heading>Storage is almost exceeded</Heading>
    <Content>
      Your storage space is over 80% utilized. We recommend
      that you upgrade the storage space to avoid
      disruptions during backups.
    </Content>
  </Note>

  <Note variant="danger">
    <Heading>No SSL certificate could be issued</Heading>
    <Content>
      No SSL certificate could be issued for this domain
      because the domain IP does not point to your server
      IP.
    </Content>
  </Note>
</Row>;
