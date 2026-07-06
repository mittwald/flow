import {
  Button,
  IconClose,
  Image,
} from "@mittwald/flow-react-components";

<div
  className="flow--light-box flow--light-box--fit-screen"
  style={{ backgroundColor: "transparent" }}
>
  <section role="dialog">
    <div className="flow--light-box--content">
      <Image
        width={200}
        src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg"
      />
    </div>
    <div className="flow--light-box--actions">
      <Button color="light-static" variant="soft">
        <IconClose />
      </Button>
    </div>
  </section>
</div>;
