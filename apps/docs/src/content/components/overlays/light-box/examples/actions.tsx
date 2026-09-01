import {
  ActionGroup,
  Button,
  IconDelete,
  IconDownload,
  Image,
  LightBox,
  LightBoxTrigger,
} from "@mittwald/flow-react-components";

<LightBoxTrigger>
  <Button>Open LightBox</Button>
  <LightBox>
    <Image src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg" />
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
