import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const states = ["info", "success", "warning", "danger"] as const;
const legendPositions = ["top", "right", "bottom", "left"] as const;

test.each(testEnvironments)(
  "DonutChart default (%s)",
  async ({ testScreenshot, render, components: { Flex, DonutChart } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Flex gap="s">
          {states.map((status) => (
            <DonutChart
              aria-label="label"
              value={30}
              status={status}
              key={status}
            />
          ))}
        </Flex>
        <DonutChart
          aria-label="label"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          maxValue={600}
          value={300}
          size="l"
        />
        <DonutChart aria-label="label" value={3}>
          Custom content
        </DonutChart>
      </Flex>,
    );

    await testScreenshot("DonutChart default");
  },
);

test.each(testEnvironments)(
  "DonutChart segmented (%s)",
  async ({ testScreenshot, render, components: { Flex, DonutChart } }) => {
    await render(
      <Flex gap="s">
        {legendPositions.map((position) => (
          <DonutChart
            key={position}
            aria-label="label"
            segments={[
              { title: "Segment 1", value: 50 },
              { title: "Segment 2", value: 25 },
              { title: "Segment 3", value: 12 },
            ]}
            legendPosition={position}
          />
        ))}
      </Flex>,
    );

    await testScreenshot("DonutChart segmented");
  },
);

test.each(testEnvironments)(
  "DonutChart edge cases (%s)",
  async ({ testScreenshot, render, components: { Flex, DonutChart } }) => {
    await render(
      <Flex direction="column" gap="m">
        <DonutChart
          aria-label="label"
          value={1000000000000}
          maxValue={1000000000000}
        />
        <DonutChart aria-label="label" value={10}>
          Lorem ipsum dolor sit amet consectetur.
        </DonutChart>
      </Flex>,
    );

    await testScreenshot("DonutChart edge cases");
  },
);
