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
              "passwordCreationField.validation.charPool.special.min.short":
                "Overwritten Translation YAY!",
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
              "textField.characters": "France YAY!",
              "label.optional": "(Baguette)",
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
