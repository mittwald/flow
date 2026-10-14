import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { SkeletonComparison } from "@/tests/lib/SkeletonComparison";
import { test } from "vitest";

// LegendItem is remote-capable since 1.5.17; before, a remote Legend is empty.
const legendItemSince = "1.5.17";

test.skipIf(crossVersion({ below: legendItemSince })).each(testEnvironments)(
  "Legend (%s)",
  async ({ testScreenshot, render, components: { Legend, LegendItem } }) => {
    await render(
      <Legend>
        <LegendItem color="sea-green">Webspace</LegendItem>
        <LegendItem color="palatinate-blue">Datenbanken</LegendItem>
        <LegendItem color="tangerine">E-Mail</LegendItem>
        <LegendItem color="magenta">Backups</LegendItem>
        <LegendItem color="#555">Sonstiges</LegendItem>
        <LegendItem>Ohne Farbe</LegendItem>
      </Legend>,
    );

    await testScreenshot("Legend");
  },
);

test.skipIf(crossVersion({ below: legendItemSince })).each(testEnvironments)(
  "Legend in SkeletonMode (%s)",
  async ({ testScreenshot, render, components }) => {
    const { Legend, LegendItem } = components;

    await render(
      <SkeletonComparison components={components}>
        <Legend>
          <LegendItem color="sea-green">Webspace</LegendItem>
          <LegendItem color="#555">Sonstiges</LegendItem>
        </Legend>
      </SkeletonComparison>,
    );

    await testScreenshot("Legend in SkeletonMode");
  },
);
