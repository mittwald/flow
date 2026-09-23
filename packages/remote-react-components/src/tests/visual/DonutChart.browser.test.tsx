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
              { title: "Segment 1", value: 30 },
              { title: "Segment 2", value: 15 },
              { title: "Segment 3", value: 25, color: "lime" },
              { title: "Segment 4", value: 12, color: "#555" },
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
  async ({
    testScreenshot,
    render,
    components: { Flex, DonutChart, ProgressBar },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <DonutChart
          aria-label="label"
          value={1000000000000}
          maxValue={1000000000000}
        />
        <DonutChart aria-label="label" value={10}>
          The Death Star is now fully operational.
        </DonutChart>
        {/* A flex row stretches its items, which must not move the value. */}
        <Flex gap="l">
          <DonutChart aria-label="label" value={30}>
            In Flex
          </DonutChart>
          <Flex direction="column" gap="m" grow>
            {[80, 45, 20].map((value) => (
              <ProgressBar aria-label="label" key={value} value={value} />
            ))}
          </Flex>
        </Flex>
      </Flex>,
    );

    await testScreenshot("DonutChart edge cases");
  },
);
