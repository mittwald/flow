import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import Content from "@mittwald/flow-react-components/Content";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";

<Row>
  <LabeledValue>
    <Label>Short-ID</Label>
    <Content>p-wut3uw</Content>
    <CopyButton text="p-wut3uw" />
  </LabeledValue>

  <LabeledValue>
    <Label>Datenbankserver</Label>
    <Content>
      mysql-kq3v4g.ge-s-hopovh.db.project.host
    </Content>
    <CopyButton text="mysql-kq3v4g.ge-s-hopovh.db.project.host" />
  </LabeledValue>

  <LabeledValue>
    <Label>Projektdomain</Label>
    <Link>
      <Text>p-lol3qe.project.space</Text>
      <IconExternalLink />
    </Link>
    <CopyButton text="p-lol3qe.project.space" />
  </LabeledValue>
</Row>;
