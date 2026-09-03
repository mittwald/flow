import { expect, test } from "vitest";
import { splitHeadline } from "./githubReleases";

test("takes the leading H1 as the headline and drops it from the body", () => {
  expect(
    splitHeadline(
      "# Upgrade with one command\n\n## Highlights\n\n- Something\n",
    ),
  ).toStrictEqual({
    headline: "Upgrade with one command",
    body: "## Highlights\n\n- Something\n",
  });
});

test("keeps an H1 that is not the first content", () => {
  const body = "Intro.\n\n# Not a headline\n";
  expect(splitHeadline(body)).toStrictEqual({ body });
});

test("ignores a deeper heading", () => {
  const body = "## Highlights\n\n- Something\n";
  expect(splitHeadline(body)).toStrictEqual({ body });
});

test("handles an empty body", () => {
  expect(splitHeadline("")).toStrictEqual({ body: "" });
});
