import {
  MarkdownEditor,
  Label,
  Icon,
  FieldDescription,
} from "@mittwald/flow-react-components";
import { IconAt, IconMoodSmile } from "@tabler/icons-react";

export default function MarkdownEditorExample() {
  return (
    <MarkdownEditor
      defaultValue=""
      rows={5}
      toolbarTools={[
        {
          id: "mention",
          label: "Insert mention",
          icon: (
            <Icon>
              <IconAt />
            </Icon>
          ),
          onPress: ({
            value: currentValue,
            setValue: setEditorValue,
          }) => {
            const mention = "@username";
            const cursorPos = currentValue.length;
            const nextValue = `${currentValue}${mention}`;
            setEditorValue(
              nextValue,
              cursorPos + mention.length,
              cursorPos + mention.length,
            );
          },
        },
        {
          id: "emoji",
          label: "Insert emoji",
          icon: (
            <Icon>
              <IconMoodSmile />
            </Icon>
          ),
          onPress: ({
            value: currentValue,
            setValue: setEditorValue,
          }) => {
            const emoji = " 😊";
            const cursorPos = currentValue.length;
            const nextValue = `${currentValue}${emoji}`;
            setEditorValue(
              nextValue,
              cursorPos + emoji.length,
              cursorPos + emoji.length,
            );
          },
        },
      ]}
    >
      <Label>Custom Tools Example</Label>
      <FieldDescription>
        Click the custom buttons to insert mentions or
        emojis.
      </FieldDescription>
    </MarkdownEditor>
  );
}
