import { Button } from "@mittwald/flow-react-components/Button";
import { IconClose } from "@mittwald/flow-react-components/Icons";
import { Image } from "@mittwald/flow-react-components/Image";

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
