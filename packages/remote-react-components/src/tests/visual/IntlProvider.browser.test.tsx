import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

// IntlProvider is available from alpha.791.
test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "IntlProvider (%s)",
  async ({
    testScreenshot,
    render,
    components: { IntlProvider, TranslationProvider, Flex, TextField, Label },
  }) => {
    await render(
      <Flex gap="s" align="center">
        <IntlProvider locale="en-US">
          <TranslationProvider
            translations={{
              "en-US": {
                Label: {
                  optional: "TRANSLATED",
                },
              },
            }}
          >
            <TextField>
              <Label optional={true}>TextField</Label>
            </TextField>
          </TranslationProvider>
        </IntlProvider>
      </Flex>,
    );

    await testScreenshot("IntlProvider");
  },
);
