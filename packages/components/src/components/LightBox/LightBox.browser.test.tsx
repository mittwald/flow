import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { LightBox } from "@/components/LightBox";
import LightBoxTrigger from "@/components/LightBox/components/LightBoxTrigger";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { useOverlayController } from "@/lib/controller";

const lightBox = () => page.getByRole("dialog");
const closeButton = () => page.getByRole("button", { name: "Close" });

test("the trigger opens the light box and the close button closes it", async () => {
  render(
    <LightBoxTrigger>
      <Button>Open</Button>
      <LightBox>
        <Text>A picture of a starship</Text>
      </LightBox>
    </LightBoxTrigger>,
  );

  await expect.element(lightBox()).not.toBeInTheDocument();

  await page.getByRole("button", { name: "Open" }).click();

  await expect.element(lightBox()).toBeVisible();
  await expect.element(page.getByText("A picture of a starship")).toBeVisible();

  await closeButton().click();

  await expect.element(lightBox()).not.toBeInTheDocument();
});

test("escape closes the light box", async () => {
  render(
    <LightBoxTrigger>
      <Button>Open</Button>
      <LightBox>
        <Text>A picture of a starship</Text>
      </LightBox>
    </LightBoxTrigger>,
  );

  await page.getByRole("button", { name: "Open" }).click();
  await expect.element(lightBox()).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(lightBox()).not.toBeInTheDocument();
});

/*
 * A controller passed as a prop wins over the one the light box would take from
 * its context, so the surrounding app can open it without a trigger.
 */
test("a controller from props opens and closes the light box", async () => {
  const Fixture = () => {
    const controller = useOverlayController("LightBox");

    return (
      <>
        <Button onPress={() => controller.open()}>Show</Button>
        <LightBox controller={controller}>
          <Text>A picture of a starship</Text>
        </LightBox>
      </>
    );
  };

  render(<Fixture />);

  await expect.element(lightBox()).not.toBeInTheDocument();

  await page.getByRole("button", { name: "Show" }).click();

  await expect.element(lightBox()).toBeVisible();

  await closeButton().click();

  await expect.element(lightBox()).not.toBeInTheDocument();
});
