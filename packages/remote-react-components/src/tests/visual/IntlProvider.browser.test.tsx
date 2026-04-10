import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
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
