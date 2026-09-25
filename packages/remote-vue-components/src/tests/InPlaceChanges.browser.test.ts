import { DonutChart } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

/*
 * Vue's idiom for changing data is to change it in place. The reference stays
 * the same, and both the wrapper and remote-dom skip a property whose value is
 * identical — so the wrapper has to notice the change itself.
 */
afterEach(() => cleanupRemote());

test("an array changed in place reaches the host", async () => {
  const segments = ref([{ title: "Alpha", value: 1 }]);

  renderRemote(
    defineComponent(
      () => () =>
        h(DonutChart, {
          "aria-label": "Crew",
          showLegend: true,
          segments: segments.value,
        }),
    ),
  );

  await expect.element(page.getByText("Alpha (")).toBeVisible();

  segments.value.push({ title: "Beta", value: 2 });
  await expect.element(page.getByText("Beta (")).toBeVisible();

  /* An object inside it, changed in place, too. */
  const [first] = segments.value;
  if (first) {
    first.title = "Gamma";
  }
  await nextTick();
  await expect.element(page.getByText("Gamma (")).toBeVisible();
  await expect.element(page.getByText("Alpha (")).not.toBeInTheDocument();
});
