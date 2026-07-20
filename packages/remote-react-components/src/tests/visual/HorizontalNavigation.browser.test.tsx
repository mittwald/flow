import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "HorizontalNavigation (%s)",
  async ({
    testScreenshot,
    render,
    components: { HorizontalNavigation, Link, AlertIcon },
  }) => {
    await render(
      <HorizontalNavigation aria-label="Horizontal navigation">
        <Link href="#">Link</Link>
        <Link href="#" aria-current="page">
          Current Link
        </Link>
        <Link href="#">
          Link with Status
          <AlertIcon status="danger" />
        </Link>
      </HorizontalNavigation>,
    );

    await testScreenshot("HorizontalNavigation");
  },
);

test.each(testEnvironments)(
  "HorizontalNavigation collapsed (%s)",
  async ({
    testScreenshot,
    render,
    components: { HorizontalNavigation, Link },
  }) => {
    await render(
      <HorizontalNavigation aria-label="Horizontal navigation">
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#">The Rebel Alliance versus the Empire</Link>
        <Link href="#" aria-current="page">
          The Rebel Alliance versus the Empire
        </Link>
      </HorizontalNavigation>,
    );

    await testScreenshot("HorizontalNavigation - collapsed");

    await page.getByRole("button", { name: /More|Weitere/ }).click();

    await testScreenshot("HorizontalNavigation - context menu opened");
  },
);
