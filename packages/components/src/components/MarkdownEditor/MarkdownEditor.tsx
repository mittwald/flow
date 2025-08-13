import { type FC, useState } from "react";
import type { TextAreaTextApi } from "@uiw/react-md-editor";
import MDEditor, { commands, type TextState } from "@uiw/react-md-editor";
import { Button } from "@/components/Button";

export const MarkdownEditor: FC = () => {
  const [value, setValue] = useState("");

  const boldCommand = {
    name: "custom-bold",
    keyCommand: "bold",
    buttonProps: { "aria-label": "Bold" },
    icon: <Button>asdf</Button>,
    render: (
      command: commands.ICommand,
      disabled: boolean,
      executeCommand: (
        arg0: commands.ICommand,
        arg1: string | undefined,
      ) => void,
    ) => (
      <Button
        aria-label="Insert title2"
        onPress={() => {
          executeCommand(command, command.groupName);
        }}
      >
        asd
      </Button>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      const selectedText = state.selectedText || "bold text";
      api.replaceSelection(`**${selectedText}**`);
    },
  };

  return (
    <>
      <MDEditor
        value={value}
        onChange={(v) => setValue(v ?? "")}
        commands={[boldCommand, commands.bold]}
      />
      <MDEditor.Markdown source={value} />
    </>
  );
};

export default MarkdownEditor;

/*
textareaProps={{
          placeholder: 'Please enter Markdown text',
          maxLength: 10
        }}
 */
