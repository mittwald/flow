import { render } from "vitest-browser-react";
import { commands, page } from "vitest/browser";
import { afterEach, describe, expect, test } from "vitest";
import { ProgressBar } from "@/components/ProgressBar";
import styles from "@/components/ProgressBar/ProgressBar.module.scss";

const bar = () => page.getByRole("progressbar");

test("the value is reported and shown as a percentage", async () => {
  render(<ProgressBar aria-label="Storage" value={40} />);

  await expect.element(bar()).toHaveAttribute("aria-valuenow", "40");
  await expect.element(bar()).toHaveTextContent("40 %");
});

test("showMaxValue puts the maximum next to the value", async () => {
  render(
    <ProgressBar aria-label="Storage" value={40} maxValue={80} showMaxValue />,
  );

  await expect.element(bar()).toHaveAttribute("aria-valuemax", "80");
  await expect.element(bar()).toHaveTextContent("40 % of 80 %");
});

/*
 * Without `formatOptions` the value is a percentage; with them it is whatever
 * the number formatter makes of it, and the percent sign has to go.
 */
test("formatOptions replace the percent formatting", async () => {
  render(
    <ProgressBar
      aria-label="Storage"
      value={40}
      formatOptions={{ maximumFractionDigits: 0 }}
    />,
  );

  await expect.element(bar()).toHaveTextContent("40");
  await expect.element(bar()).not.toHaveTextContent("40 %");
});

test("valueLabel replaces the computed text", async () => {
  render(
    <ProgressBar aria-label="Storage" value={40} valueLabel="Almost full" />,
  );

  await expect.element(bar()).toHaveTextContent("Almost full");
  await expect.element(bar()).not.toHaveTextContent("40 %");
});

/*
 * Segments own the value: the bar reports their sum, and each one shows up in
 * the legend with its own value.
 */
test("segments add up to the reported value and are listed in the legend", async () => {
  render(
    <ProgressBar
      aria-label="Storage"
      segments={[
        { value: 30, title: "Documents" },
        { value: 20, title: "Images" },
      ]}
    />,
  );

  await expect.element(bar()).toHaveAttribute("aria-valuenow", "50");
  await expect.element(bar()).toHaveTextContent("50 %");
  await expect.element(bar()).toHaveTextContent("Documents (30 %)");
  await expect.element(bar()).toHaveTextContent("Images (20 %)");
});

test("a segment's valueText wins over its value", async () => {
  render(
    <ProgressBar
      aria-label="Storage"
      segments={[{ value: 30, title: "Documents", valueText: "3 GB" }]}
    />,
  );

  await expect.element(bar()).toHaveTextContent("Documents (3 GB)");
});

test("showLegend false drops the legend but keeps the value", async () => {
  render(
    <ProgressBar
      aria-label="Storage"
      showLegend={false}
      segments={[{ value: 30, title: "Documents" }]}
    />,
  );

  await expect.element(bar()).toHaveAttribute("aria-valuenow", "30");
  await expect.element(bar()).not.toHaveTextContent("Documents");
});

describe("with motion allowed", () => {
  afterEach(() => commands.setReducedMotion("reduce"));

  test("the fill grows into its value", async () => {
    await commands.setReducedMotion("no-preference");
    const screen = await render(
      <ProgressBar aria-label="Storage" value={40} />,
    );

    const fills = screen.container.querySelectorAll(`.${styles.fill}`);
    expect(fills).toHaveLength(1);
    for (const fill of fills) {
      expect(getComputedStyle(fill).animationName).not.toBe("none");
      expect(getComputedStyle(fill).animationDuration).toBe("0.8s");
    }
  });
});
