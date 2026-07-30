import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "TabNavigation (%s)",
  async ({
    testScreenshot,
    render,
    components: { TabNavigation, Link, AlertIcon },
  }) => {
    await render(
      <TabNavigation aria-label="Tab navigation">
        <Link href="#">Link</Link>
        <Link href="#" aria-current="page">
          Current Link
        </Link>
        <Link href="#">
          Link with Status
          <AlertIcon status="danger" />
        </Link>
      </TabNavigation>,
    );

    await testScreenshot("TabNavigation");
  },
);

test.each(testEnvironments)(
  "TabNavigation collapsed (%s)",
  async ({ testScreenshot, render, components: { TabNavigation, Link } }) => {
    await render(
      <TabNavigation aria-label="Tab navigation">
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#" aria-current="page">
          The Rebel Alliance versus the Empire
        </Link>
      </TabNavigation>,
    );

    await testScreenshot("TabNavigation - collapsed");

    await page.getByRole("button", { name: /More|Weitere/ }).click();

    await testScreenshot("TabNavigation - context menu opened");
  },
);
