import { render } from "vitest-browser-react";
import { commands, page } from "vitest/browser";
import { afterEach, describe, expect, test } from "vitest";
import { DonutChart } from "@/components/DonutChart";
import styles from "@/components/DonutChart/DonutChart.module.scss";
import { Text } from "@/components/Text";

const chart = () => page.getByRole("progressbar");

test("the value is reported and shown as a percentage", async () => {
  render(<DonutChart aria-label="Storage" value={40} />);

  await expect.element(chart()).toHaveAttribute("aria-valuenow", "40");
  await expect.element(chart()).toHaveTextContent("40 %");
});

/*
 * Segments own the value: the chart reports their sum, and each one shows up
 * in the legend with its own value.
 */
test("segments add up to the reported value and are listed in the legend", async () => {
  render(
    <DonutChart
      aria-label="Storage"
      segments={[
        { value: 30, title: "Documents" },
        { value: 20, title: "Images" },
      ]}
    />,
  );

  await expect.element(chart()).toHaveAttribute("aria-valuenow", "50");
  await expect.element(page.getByText("Documents (30 %)")).toBeVisible();
  await expect.element(page.getByText("Images (20 %)")).toBeVisible();
});

test("a segment's valueText wins over its value", async () => {
  render(
    <DonutChart
      aria-label="Storage"
      segments={[{ value: 30, title: "Documents", valueText: "3 GB" }]}
    />,
  );

  await expect.element(page.getByText("Documents (3 GB)")).toBeVisible();
});

test("showLegend false drops the legend but keeps the value", async () => {
  render(
    <DonutChart
      aria-label="Storage"
      showLegend={false}
      segments={[{ value: 30, title: "Documents" }]}
    />,
  );

  await expect.element(chart()).toHaveAttribute("aria-valuenow", "30");
  await expect.element(page.getByText(/Documents/)).not.toBeInTheDocument();
});

test("formatOptions replace the percent formatting", async () => {
  render(
    <DonutChart
      aria-label="Storage"
      value={40}
      formatOptions={{ maximumFractionDigits: 0 }}
    />,
  );

  await expect.element(chart()).toHaveTextContent("40");
  await expect.element(chart()).not.toHaveTextContent("40 %");
});

// Children take the place of the computed value in the middle of the donut.
test("children replace the value in the middle", async () => {
  render(
    <DonutChart aria-label="Storage" value={40}>
      <Text>Almost full</Text>
    </DonutChart>,
  );

  await expect.element(chart()).toHaveTextContent("Almost full");
  await expect.element(chart()).not.toHaveTextContent("40 %");
});

describe("with motion allowed", () => {
  afterEach(() => commands.setReducedMotion("reduce"));

  test("the fill and every segment grow into their value", async () => {
    await commands.setReducedMotion("no-preference");
    const screen = await render(
      <>
        <DonutChart aria-label="Storage" value={40} />
        <DonutChart
          aria-label="Storage"
          segments={[
            { value: 30, title: "Documents" },
            { value: 20, title: "Images" },
          ]}
        />
      </>,
    );

    const circles = screen.container.querySelectorAll(
      `.${styles.fill}, .${styles.segment}`,
    );
    expect(circles).toHaveLength(3);
    for (const circle of circles) {
      expect(getComputedStyle(circle).animationName).not.toBe("none");
      expect(getComputedStyle(circle).animationDuration).toBe("0.8s");
    }
  });
});
