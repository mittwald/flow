import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { LightBoxGallery } from "@/components/LightBox";
import { Text } from "@/components/Text";
import styles from "./LightBoxGallery.module.scss";

const previous = () => page.getByRole("button", { name: "Previous" });
const next = () => page.getByRole("button", { name: "Next" });
const carousel = () => page.getByRole("region", { name: "Image gallery" });

const renderGallery = (defaultIndex?: number) =>
  render(
    <LightBoxGallery defaultIndex={defaultIndex}>
      <Text>Starship</Text>
      <Text>Freighter</Text>
      <Text>Shuttle</Text>
    </LightBoxGallery>,
  );

// Only the current item is mounted, so the others are not just hidden.
test("the gallery shows one item at a time and pages forward", async () => {
  renderGallery();

  await expect.element(page.getByText("Starship")).toBeVisible();
  await expect.element(page.getByText("Freighter")).not.toBeInTheDocument();

  await next().click();

  await expect.element(page.getByText("Freighter")).toBeVisible();
  await expect.element(page.getByText("Starship")).not.toBeInTheDocument();

  await previous().click();

  await expect.element(page.getByText("Starship")).toBeVisible();
});

test("the paging buttons stop at the first and the last item", async () => {
  renderGallery();

  await expect.element(previous()).toBeDisabled();
  await expect.element(next()).not.toBeDisabled();

  await next().click();
  await next().click();

  await expect.element(page.getByText("Shuttle")).toBeVisible();
  await expect.element(next()).toBeDisabled();
  await expect.element(previous()).not.toBeDisabled();
});

test("defaultIndex picks the item the gallery opens on", async () => {
  renderGallery(2);

  await expect.element(page.getByText("Shuttle")).toBeVisible();
  await expect.element(next()).toBeDisabled();
});

test("the arrow keys page through the gallery", async () => {
  renderGallery();

  await carousel().click();
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(page.getByText("Freighter")).toBeVisible();

  await userEvent.keyboard("{ArrowLeft}");

  await expect.element(page.getByText("Starship")).toBeVisible();

  // The first item is the end of the line — the key must not wrap around.
  await userEvent.keyboard("{ArrowLeft}");

  await expect.element(page.getByText("Starship")).toBeVisible();
});

/*
 * The indicator is a plain container with an `aria-label` and no role, so it is
 * read off the attribute rather than through a role query.
 */
test("the indicator reports the position in the gallery", async () => {
  renderGallery();

  const position = () =>
    document.querySelector(`.${styles.indicators}`)?.getAttribute("aria-label");

  await expect.poll(position).toBe("1 of 3");

  await next().click();

  await expect.poll(position).toBe("2 of 3");
});
