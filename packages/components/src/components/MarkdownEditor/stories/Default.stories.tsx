import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import type { MarkdownProps } from "@/components/Markdown";
import ReactMarkdown from "react-markdown";

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
            return (
              <strong
                style={{
                  color: "var(--color--primary)",
                  background: "var(--color--primary-subtle)",
                  borderRadius: "var(--border-radius-pill)",
                  padding: "0 var(--space-1)",
                }}
              >
                @{children}
              </strong>
            );
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

export const WithCustomMentionPreview: Story = {
  args: {
    defaultValue: "Say hello to [Luke Skywalker](mention:user-luke)",
  },
  render: (props) => (
    <MarkdownEditor {...props} markdownComponent={DemoMentionMarkdownPreview}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};
