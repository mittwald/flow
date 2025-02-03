import { Button } from "@mittwald/flow-react-components";
import {
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components";
import { Image } from "@mittwald/flow-react-components";

<LightBoxTrigger>
  <Button>Open LightBox</Button>
  <LightBox fitScreen={false}>
    <Image src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg" />
  </LightBox>
</LightBoxTrigger>;
