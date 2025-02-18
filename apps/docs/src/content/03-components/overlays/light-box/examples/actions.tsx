import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import {
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components";
import { Image } from "@mittwald/flow-react-components";
import {
  IconDelete,
  IconDownload,
} from "@mittwald/flow-react-components";

<LightBoxTrigger>
  <Button>Open LightBox</Button>
  <LightBox>
    <Image src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg" />
    <ActionGroup>
      <Button>
        <IconDownload />
      </Button>
      <Button>
        <IconDelete />
      </Button>
    </ActionGroup>
  </LightBox>
</LightBoxTrigger>;
