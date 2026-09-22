import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Heading } from "@/components/Heading";
import { TunnelEntry as PublicTunnelEntry } from "@/components/TunnelEntry";
import { getTunnelProviderId, TunnelEntry } from "./tunnel";

test("`TunnelEntry` is the very component the main entry point exports", () => {
  expect(TunnelEntry).toBe(PublicTunnelEntry);
});

test("`getTunnelProviderId` addresses a Flow component's own tunnel exit", async () => {
  render(
    <Heading>
      Project
      <TunnelEntry
        id="headingContent"
        providerId={getTunnelProviderId("Heading")}
      >
        <span data-testid="suffix">suffix</span>
      </TunnelEntry>
    </Heading>,
  );

  const suffix = page.getByTestId("suffix");
  await expect.element(suffix).toBeVisible();

  const heading = page.getByRole("heading").element();
  expect(heading.contains(suffix.element())).toBe(true);
});
