import {
  Button,
  Image,
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components";

<LightBoxTrigger>
  <Button>
    <Image
      width={100}
      withBorder
      alt="mittwald"
      src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg"
    />
  </Button>
  <LightBox>
    <Image
      alt="mittwald"
      src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg"
    />
  </LightBox>
</LightBoxTrigger>;
