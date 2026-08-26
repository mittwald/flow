import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { useForm } from "react-hook-form";
import { Rating } from "@/components/Rating";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Form, typedField } from "@/integrations/react-hook-form";
import { RatingSegment } from "@/components/Rating/components/RatingSegment";
import { IconStarFilled } from "@/components/Icon/components/icons";
import styles from "./Rating.module.scss";

const segments = (): HTMLElement[] =>
  Array.from(document.querySelectorAll(`.${styles.ratingSegment}`));

// Both icons are stacked and cross-faded, so filled is an opacity, not a node.
const fillStates = (): boolean[] =>
  segments().map((segment) => {
    const filled = segment.querySelector(`.${styles.filled}`);
    return !!filled && getComputedStyle(filled).opacity === "1";
  });

test("segment children set the number of segments and their labels", async () => {
  await render(
    <Rating aria-label="Rating" maxValue={10} value={2}>
      <RatingSegment />
      <RatingSegment />
      <RatingSegment />
    </Rating>,
  );

  expect(segments()).toHaveLength(3);
  await expect
    .element(page.getByRole("radio", { name: "2 of 3" }))
    .toBeInTheDocument();
});

test("a segment label can be overridden", async () => {
  await render(
    <Rating aria-label="Rating">
      <RatingSegment aria-label="Terrible" />
      <RatingSegment aria-label="Great" />
    </Rating>,
  );

  await expect
    .element(page.getByRole("radio", { name: "Terrible" }))
    .toBeInTheDocument();
});

test("single fill previews the hovered segment", async () => {
  await render(<Rating aria-label="Rating" fill="single" value={2} />);

  // Hover the label, not the radio input — the stacked icons cover the input.
  await page.getByLocator("label:has(input[value='4'])").hover();

  await expect.poll(fillStates).toEqual([false, false, false, true, false]);
});

test("a segment icon wins over the rating icon", async () => {
  await render(
    <Rating
      aria-label="Rating"
      value={2}
      iconFilled={<IconStarFilled data-testid="rating-icon" />}
    >
      <RatingSegment />
      <RatingSegment
        iconFilled={<IconStarFilled data-testid="segment-icon" />}
      />
    </Rating>,
  );

  const [first, second] = segments();

  expect(first?.querySelector("[data-testid='rating-icon']")).not.toBeNull();
  expect(second?.querySelector("[data-testid='segment-icon']")).not.toBeNull();
});

test("the rating's size reaches the icons of a segment", async () => {
  await render(
    <Rating aria-label="Rating" value={1} size="s">
      <RatingSegment />
    </Rating>,
  );

  const [segment] = segments();
  const width = segment
    ?.querySelector(`.${styles.filled}`)
    ?.getBoundingClientRect().width;

  expect(width).toBeLessThan(24);
});

/*
 * The rating keeps the selected value in local state, so a value set from the
 * outside has to win over it.
 */
test("a value set on the form reaches the rating", async () => {
  const Fixture = () => {
    const form = useForm<{ rating: number }>({ defaultValues: { rating: 2 } });
    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={async () => undefined}>
        <Field name="rating">
          <Rating>
            <Label>Rating</Label>
          </Rating>
        </Field>
        <Button onPress={() => form.setValue("rating", 4)}>Set to 4</Button>
      </Form>
    );
  };

  await render(<Fixture />);

  const selectedValue = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>("input[type=radio]"),
    ).find((input) => input.checked)?.value;

  expect(selectedValue()).toBe("2");

  await page.getByRole("button", { name: "Set to 4" }).click();

  await expect.poll(selectedValue).toBe("4");
});

test("a click reports the value as a number and as a string", async () => {
  const onValueChange = vi.fn();
  const onChange = vi.fn();

  await render(
    <Rating
      aria-label="Rating"
      onValueChange={onValueChange}
      onChange={onChange}
    />,
  );

  await page.getByLocator("label:has(input[value='3'])").click();

  expect(onValueChange).toHaveBeenCalledWith(3);
  expect(onChange).toHaveBeenCalledWith("3");
});
