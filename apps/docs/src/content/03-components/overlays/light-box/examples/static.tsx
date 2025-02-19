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
        src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg"
      />
    </div>
    <div className="flow--light-box--actions">
      <Button color="light" variant="soft">
        <IconClose />
      </Button>
    </div>
  </section>
</div>;
