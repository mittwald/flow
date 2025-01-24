import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import {
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components/LightBox";
import { Image } from "@mittwald/flow-react-components/Image";
import {
  IconDelete,
  IconDownload,
} from "@mittwald/flow-react-components/Icons";

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
