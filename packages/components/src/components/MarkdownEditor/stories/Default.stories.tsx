import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { IconContextMenu, IconEdit } from "@/components/Icon/components/icons";
import type { MarkdownProps } from "@/components/Markdown";
import ReactMarkdown from "react-markdown";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { Action } from "@/components/Action";
import { ActionGroup } from "@/components/ActionGroup";
import { IconSignature } from "@tabler/icons-react";
import { Icon } from "@/components/Icon";
import { Color } from "@/components/Color";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Form Controls/MarkdownEditor",
  component: MarkdownEditor,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    allowResize: false,
  },
  argTypes: {
    allowResize: {
      control: "inline-radio",
      options: [false, true, "horizontal", "vertical"],
    },
  },
  render: (props) => (
    <MarkdownEditor placeholder="Transmit a message to the fleet..." {...props}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};
export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 100 },
};

export const WithFieldError: Story = {
  render: (props) => (
    <MarkdownEditor {...props} isInvalid defaultValue="hello">
      <Label>Message</Label>
      <FieldError>Transmission garbled</FieldError>
    </MarkdownEditor>
  ),
};

export const AutoResizeable: Story = {
  render: (props) => (
    <MarkdownEditor {...props} autoResizeMaxRows={5} rows={3}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};

export const WithOnChange: Story = {
  render: (props) => {
    return (
      <MarkdownEditor {...props} onChange={(v) => console.log(v)}>
        <Label>Message</Label>
      </MarkdownEditor>
    );
  },
};

export const WithRef: StoryObj = {
  render: (props) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const handleFocus = () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    return (
      <Section>
        <MarkdownEditor {...props} ref={editorRef}>
          <Label>Message</Label>
        </MarkdownEditor>
        <Button type="button" onClick={handleFocus}>
          Set focus
        </Button>
      </Section>
    );
  },
};

const DemoMentionMarkdownPreview = ({
  children,
  className,
  style,
}: MarkdownProps) => (
  <div className={className} style={style}>
    <ReactMarkdown
      components={{
        a: ({ children, href }) => {
          if (href?.includes("mention:")) {
            return <Color color="teal">@{children}</Color>;
          }

          return <a href={href}>{children}</a>;
        },
      }}
      urlTransform={(url) => {
        // add urlTransform to support custom protocols in `react-markdown`
        return url;
      }}
    >
      {String(children ?? "")}
    </ReactMarkdown>
  </div>
);

export const WithCustomMarkdownComponent: Story = {
  args: {
    defaultValue: "Say hello to [Luke Skywalker](mention:user-luke)",
  },
  render: (props) => (
    <MarkdownEditor {...props} markdownComponent={DemoMentionMarkdownPreview}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};

export const WithCustomToolbarTool: Story = {
  render: (props) => {
    const [value, setValue] = useState("# Message\n\nHello there");

    const insertAtEnd = (content: string) => {
      setValue((currentValue) => `${currentValue}${content}`);
    };

    return (
      <MarkdownEditor {...props} value={value} onChange={setValue}>
        <Label>Message</Label>
        <Button
          aria-label="Insert signature"
          onPress={() => {
            const signature = "\n\n-- Flow Team";
            if (value.endsWith(signature)) {
              return;
            }

            insertAtEnd(signature);
          }}
        >
          <Icon>
            <IconSignature />
          </Icon>
        </Button>
        <ContextMenuTrigger>
          <Button aria-label="Open snippets">
            <IconContextMenu />
          </Button>
          <ContextMenu
            onAction={(key) => {
              if (key === "intro") {
                insertAtEnd("## Quick intro\n\nThanks for your message.");
              }
              if (key === "closing") {
                insertAtEnd("\n\nBest regards,\nFlow Team");
              }
            }}
          >
            <MenuItem id="intro">Insert intro</MenuItem>
            <MenuItem id="closing">Insert closing</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <ModalTrigger>
          <Button aria-label="Open templates">
            <IconEdit />
          </Button>
          <Modal>
            <Heading>Insert template</Heading>
            <Content>
              <Text>Insert a predefined answer template into the editor.</Text>
            </Content>
            <ActionGroup>
              <Action closeModal>
                <Button
                  color="success"
                  onPress={() => {
                    insertAtEnd("## Next steps\n\n- Review content\n- Publish");
                  }}
                >
                  Insert template
                </Button>
                <Button color="secondary" variant="soft">
                  Cancel
                </Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>
      </MarkdownEditor>
    );
  },
};
