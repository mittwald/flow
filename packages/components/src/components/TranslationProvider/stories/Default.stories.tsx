import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import { TranslationProvider } from "@/components/TranslationProvider";
import { I18nProvider } from "react-aria";
import { PasswordCreationField } from "@/components/PasswordCreationField";

const meta: Meta = {
  title: "Content/TranslationProvider",
  render: (props) => {
    return (
      <I18nProvider locale={"de-DE"}>
        <TranslationProvider
          translations={{
            "de-DE": {
              "validation.charPool.special.min.short":
                "Overwritten Translation YAY!",
            },
          }}
        >
          <PasswordCreationField onChange={action("onChange")} {...props}>
            <Label>Password</Label>
          </PasswordCreationField>
        </TranslationProvider>
      </I18nProvider>
    );
  },
};
export default meta;

type Story = StoryObj<typeof PasswordCreationField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};
