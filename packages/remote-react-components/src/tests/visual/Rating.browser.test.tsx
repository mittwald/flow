import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import {
  IconMoodEmpty,
  IconMoodEmptyFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodSad,
  IconMoodSadFilled,
} from "@tabler/icons-react";

const moods = [
  {
    label: "Bad",
    color: "danger",
    Empty: IconMoodSad,
    Filled: IconMoodSadFilled,
  },
  {
    label: "Okay",
    color: "warning",
    Empty: IconMoodEmpty,
    Filled: IconMoodEmptyFilled,
  },
  {
    label: "Great",
    color: "success",
    Empty: IconMoodHappy,
    Filled: IconMoodHappyFilled,
  },
] as const;

test.each(testEnvironments)(
  "Rating states (%s)",
  async ({ testScreenshot, render, components: { Flex, Rating, Label } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Rating>
          <Label>Default</Label>
        </Rating>
        <Rating value={3}>
          <Label>Value</Label>
        </Rating>
        <Rating value={5} size="s">
          <Label>Small</Label>
        </Rating>
        <Rating value={5} isReadOnly>
          <Label>Readonly</Label>
        </Rating>
        <Rating value={3} isDisabled>
          <Label>Disabled</Label>
        </Rating>
      </Flex>,
    );

    await testScreenshot("Rating states");
  },
);

test.each(testEnvironments)(
  "Rating interaction (%s)",
  async ({ testScreenshot, render, components: { Rating, Label } }) => {
    await render(
      <Rating defaultValue={1}>
        <Label>Label</Label>
      </Rating>,
    );

    const option = page.getByLocator("label:has(input[value='3'])");

    await testScreenshot("Rating interaction - default");

    await option.click();

    await testScreenshot("Rating interaction - option selected");
  },
);

// Element tree comparable from alpha.883.
test.skipIf(crossVersion({ below: "0.2.0-alpha.883" })).each(testEnvironments)(
  "Rating custom icon (%s)",
  async ({
    testScreenshot,
    render,
    components: { Rating, Label, IconHome },
  }) => {
    await render(
      <Rating
        defaultValue={2}
        iconFilled={<IconHome color="success" />}
        iconEmpty={<IconHome />}
      >
        <Label>Custom icon</Label>
      </Rating>,
    );

    await testScreenshot("Rating custom icon");
  },
);

// RatingSegment, fill and maxValue are part of the next minor.
const ratingSegmentSince = "1.1.0";

test.skipIf(crossVersion({ below: ratingSegmentSince })).each(testEnvironments)(
  "Rating segments (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Rating, RatingSegment, Label, Icon },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Rating maxValue={10} value={7}>
          <Label>maxValue</Label>
        </Rating>
        <Rating fill="single" value={2}>
          <Label>Single fill with segments</Label>
          {moods.map(({ label, color, Empty, Filled }) => (
            <RatingSegment
              key={label}
              aria-label={label}
              iconEmpty={
                <Icon>
                  <Empty />
                </Icon>
              }
              iconFilled={
                <Icon color={color}>
                  <Filled />
                </Icon>
              }
            />
          ))}
        </Rating>
      </Flex>,
    );

    await testScreenshot("Rating segments");
  },
);
