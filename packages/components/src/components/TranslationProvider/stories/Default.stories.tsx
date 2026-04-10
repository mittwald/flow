import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { TranslationProvider } from "@/components/TranslationProvider";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import { IntlProvider } from "@/components/IntlProvider";
import { TextField } from "@/components/TextField";

const meta: Meta = {
  title: "Content/TranslationProvider",
  render: (props) => {
    return (
      <IntlProvider locale={"de-DE"}>
        <TranslationProvider
          translations={{
            "de-DE": {
              PasswordCreationField: {
                "validation.charPool.special.min.short":
                  "Overwritten Translation YAY!",
              },
            },
          }}
        >
          <PasswordCreationField onChange={action("onChange")} {...props}>
            <Label>Password</Label>
          </PasswordCreationField>
        </TranslationProvider>
      </IntlProvider>
    );
  },
};
export default meta;

type Story = StoryObj<typeof PasswordCreationField>;

export const Default: Story = {};

export const WithAdditionalLocale: Story = {
  render: () => {
    return (
      <IntlProvider locale={"fr-FR"}>
        <TranslationProvider
          translations={{
            "fr-FR": {
              TextField: {
                characters: `{maxCount, select, 0 {{count}} other {{count}/{maxCount}}} Zeichen 🥐 YAY!`,
              },
              Label: {
                optional: "(🥖 Maybe?)",
              },
            },
          }}
        >
          <TextField showCharacterCount onChange={action("onChange")}>
            <Label>Password</Label>
          </TextField>
        </TranslationProvider>
      </IntlProvider>
    );
  },
};

export const WithTranslateFunction: Story = {
  render: () => {
    return (
      <IntlProvider locale={"fr-FR"}>
        <TranslationProvider
          translate={(key, variables, { component, locale }) => {
            return `${key}-${JSON.stringify(variables)}-${component}-${locale}`;
          }}
        >
          <TextField showCharacterCount onChange={action("onChange")}>
            <Label>Password</Label>
          </TextField>
        </TranslationProvider>
      </IntlProvider>
    );
  },
};
