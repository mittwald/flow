import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const states = ["info", "success", "warning", "danger"] as const;
test.each(testEnvironments)(
  "ProgressBar default (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ProgressBar, Label },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Flex gap="s">
          {states.map((status) => (
            <ProgressBar value={30} status={status} key={status}>
              <Label>Label</Label>
            </ProgressBar>
          ))}
        </Flex>
        <ProgressBar
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          maxValue={600}
          value={300}
          showMaxValue
          size="s"
        >
          <Label>Label</Label>
        </ProgressBar>
        <ProgressBar
          size="l"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          maxValue={600}
          value={300}
        >
          <Label>Label</Label>
        </ProgressBar>
      </Flex>,
    );

    await testScreenshot("ProgressBar default");
  },
);

test.each(testEnvironments)(
  "ProgressBar segmented (%s)",
  async ({
    testScreenshot,
    render,
    components: { ProgressBar, Label, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ProgressBar
          segments={[
            { title: "Segment 1", value: 50 },
            { title: "Segment 2", value: 25 },
            { title: "Segment 3", value: 12 },
          ]}
        >
          <Label>Label</Label>
        </ProgressBar>
        <ProgressBar
          segments={[
            { title: "Item 1", value: 5 },
            { title: "Item 2", value: 10 },
            { title: "Item 3", value: 4 },
            { title: "Item 4", value: 7 },
            { title: "Item 5", value: 12 },
            { title: "Item 6", value: 24 },
            { title: "Item 7", value: 5 },
            { title: "Item 8", value: 8 },
            { title: "Item 9", value: 3 },
            { title: "Item 10", value: 6 },
            { title: "Item 11", value: 16 },
          ]}
        >
          <Label>Label</Label>
        </ProgressBar>
        <ProgressBar
          segments={[
            { title: "Item 1", value: 0 },
            { title: "Item 2", value: 0 },
          ]}
        >
          <Label>Label</Label>
        </ProgressBar>
      </Flex>,
    );

    await testScreenshot("ProgressBar segmented");
  },
);

test.each(testEnvironments)(
  "ProgressBar edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ProgressBar, Label },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ProgressBar value={20}>
          <Label>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station with enough power to destroy an entire
            planet. Pursued by agents.
          </Label>
        </ProgressBar>
        <ProgressBar
          value={2000}
          maxValue={1000}
          minValue={0}
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          showMaxValue
        >
          <Label>Label</Label>
        </ProgressBar>
      </Flex>,
    );

    await testScreenshot("ProgressBar edge cases");
  },
);
