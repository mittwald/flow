import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";

<Row>
  <LabeledValue>
    <Label>Server</Label>
    <Link>MyServ-01</Link>
  </LabeledValue>

  <LabeledValue>
    <Label>Projektdomain</Label>
    <Link>
      <Text>p-lol3qe.project.space</Text>
      <IconExternalLink />
    </Link>
  </LabeledValue>
</Row>;
