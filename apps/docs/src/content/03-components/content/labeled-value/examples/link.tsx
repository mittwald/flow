import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { IconExternalLink } from "@mittwald/flow-react-components";

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
