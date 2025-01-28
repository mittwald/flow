import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TextField } from "@/components/TextField";
import { Autocomplete } from "@/components/Autocomplete";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { Label } from "@/components/Label";
import { useOverlayController } from "@/lib/controller";
import { Field, Form } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Autocomplete> = {
  title: "Form Controls/Autocomplete",
  component: Autocomplete,
  render: (props) => {
    return (
      <Autocomplete {...props}>
        <TextField>
          <Label>Autocomplete</Label>
        </TextField>

        <ContextMenu>
          <MenuItem textValue="Show details" onAction={action("Show details")}>
            Show details
          </MenuItem>
          <MenuItem textValue="Rename" onAction={action("Rename")}>
            Rename
          </MenuItem>
          <MenuItem textValue="Delete" onAction={action("Delete")}>
            Delete
          </MenuItem>
        </ContextMenu>
      </Autocomplete>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {};

export const Files: Story = {
  render: (props) => {
    const filesBase = ["html", "files"];
    const filesHtml = ["html/test1.txt", "html/test2.txt"];
    const filesFiles = ["files/test1.txt", "files/test2.txt"];

    const [files, setFiles] = useState<string[]>(filesBase);
    const form = useForm();
    const contextMenuController = useOverlayController("ContextMenu");

    const replaceFiles = (value: string) => {
      if (value === "html") {
        setFiles(filesHtml);
      }
      if (value === "files") {
        setFiles(filesFiles);
      }
      if (value.includes(".")) {
        contextMenuController.close();
      }
    };

    return (
      <Form onSubmit={() => action("submit")} form={form}>
        <Autocomplete controller={contextMenuController} {...props}>
          <Field name="file">
            <TextField>
              <Label>Autocomplete</Label>
            </TextField>
          </Field>

          <ContextMenu>
            {files.map((f) => (
              <MenuItem
                key={f}
                onAction={() => {
                  form.setValue("file", f);
                  replaceFiles(f);
                }}
                textValue={f}
              >
                {f}
              </MenuItem>
            ))}
          </ContextMenu>
        </Autocomplete>
      </Form>
    );
  },
};
