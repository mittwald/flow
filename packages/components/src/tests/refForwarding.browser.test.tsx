import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { createRef, type ReactElement } from "react";
import { AccentBox } from "@/components/AccentBox";
import { AlertText } from "@/components/AlertText";
import { Button } from "@/components/Button";
import { Chat } from "@/components/Chat";
import { Combine } from "@/components/Combine";
import { FileCard } from "@/components/FileCard";
import { FileDropZone } from "@/components/FileDropZone";
import { FileField } from "@/components/FileField";
import { Label } from "@/components/Label";
import { LightBoxGallery } from "@/components/LightBox";
import { Message } from "@/components/Message";
import { MessageThread } from "@/components/MessageThread";
import { NavigationGroup } from "@/components/Navigation";
import { Text } from "@/components/Text";

interface RefCase {
  name: string;
  /* `never` fits every ref type the components declare. */
  element: (ref: never) => ReactElement;
  tagName: string;
}

const cases: RefCase[] = [
  {
    name: "AccentBox",
    element: (ref) => <AccentBox ref={ref}>Content</AccentBox>,
    tagName: "DIV",
  },
  {
    name: "AlertText",
    element: (ref) => <AlertText ref={ref}>Text</AlertText>,
    tagName: "SPAN",
  },
  {
    name: "Chat",
    element: (ref) => <Chat ref={ref} />,
    tagName: "DIV",
  },
  {
    name: "Combine",
    element: (ref) => (
      <Combine ref={ref}>
        <Text>Text</Text>
      </Combine>
    ),
    tagName: "DIV",
  },
  {
    name: "FileDropZone",
    element: (ref) => (
      <FileDropZone ref={ref}>
        <FileField>
          <Button>Select file</Button>
        </FileField>
      </FileDropZone>
    ),
    tagName: "INPUT",
  },
  {
    name: "LightBoxGallery",
    element: (ref) => (
      <LightBoxGallery ref={ref}>{[<span key="1">Item</span>]}</LightBoxGallery>
    ),
    tagName: "DIV",
  },
  {
    name: "Message",
    element: (ref) => <Message ref={ref}>Message</Message>,
    tagName: "ARTICLE",
  },
  {
    name: "MessageThread",
    element: (ref) => <MessageThread ref={ref} />,
    tagName: "UL",
  },
  {
    name: "NavigationGroup (collapsable)",
    element: (ref) => (
      <NavigationGroup ref={ref} collapsable>
        <Label>Group</Label>
      </NavigationGroup>
    ),
    tagName: "DIV",
  },
];

test.each(cases)("$name attaches its ref", async ({ element, tagName }) => {
  const ref = createRef<HTMLElement>();

  await render(element(ref as never));

  expect(ref.current?.tagName).toBe(tagName);
});

test("FileCard forwards HTML attributes to its root", async () => {
  await render(<FileCard name="file.txt" data-testid="file-card" />);

  await expect.element(page.getByTestId("file-card")).toBeInTheDocument();
});
