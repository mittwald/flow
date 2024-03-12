import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Heading from "@mittwald/flow-react-components/Heading";
import Content from "@mittwald/flow-react-components/Content";

<Row>
  <InlineAlert status="info">
    <Heading>Email address has been archived</Heading>
    <Content>
      As your domain has been deleted, this email address
      has been archived. To be able to send and receive
      emails, you must rename the address.
    </Content>
  </InlineAlert>

  <InlineAlert status="warning">
    <Heading>Storage is almost exceeded</Heading>
    <Content>
      Your storage space is over 80% utilized. We recommend
      that you upgrade the storage space to avoid
      disruptions during backups.
    </Content>
  </InlineAlert>

  <InlineAlert status="danger">
    <Heading>No SSL certificate could be issued</Heading>
    <Content>
      No SSL certificate could be issued for this domain
      because the domain IP does not point to your server
      IP.
    </Content>
  </InlineAlert>

  <InlineAlert status="success">
    <Heading>Your app is up to date</Heading>
    <Content>
      Your app has been updated to the current version.
    </Content>
  </InlineAlert>
</Row>;
