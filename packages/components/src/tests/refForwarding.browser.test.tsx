import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { createRef, type ReactElement, type RefObject } from "react";
import { AccentBox } from "@/components/AccentBox";
import { AlertText } from "@/components/AlertText";
import { Button } from "@/components/Button";
import { Chat } from "@/components/Chat";
import { Combine } from "@/components/Combine";
import { FileDropZone } from "@/components/FileDropZone";
import { FileField } from "@/components/FileField";
import { Label } from "@/components/Label";
import { LightBoxGallery } from "@/components/LightBox";
import { Message } from "@/components/Message";
import { MessageThread } from "@/components/MessageThread";
import { NavigationGroup } from "@/components/Navigation";
import { Text } from "@/components/Text";

type TagName = keyof HTMLElementTagNameMap;

interface RefCase {
  name: string;
  tagName: string;
  setup: () => { ref: RefObject<HTMLElement | null>; element: ReactElement };
}

/* Typing the ref by its tag lets tsc catch a ref type that drifts from the element. */
const refCase = <T extends TagName>(
  name: string,
  tagName: T,
  element: (ref: RefObject<HTMLElementTagNameMap[T] | null>) => ReactElement,
): RefCase => ({
  name,
  tagName: tagName.toUpperCase(),
  setup: () => {
    const ref = createRef<HTMLElementTagNameMap[T]>();
    return { ref, element: element(ref) };
  },
});

const cases: RefCase[] = [
  refCase("AccentBox", "div", (ref) => (
    <AccentBox ref={ref}>Content</AccentBox>
  )),
  refCase("AlertText", "span", (ref) => <AlertText ref={ref}>Text</AlertText>),
  refCase("Chat", "div", (ref) => <Chat ref={ref} />),
  refCase("Combine", "div", (ref) => (
    <Combine ref={ref}>
      <Text>Text</Text>
    </Combine>
  )),
  refCase("FileDropZone", "input", (ref) => (
    <FileDropZone ref={ref}>
      <FileField>
        <Button>Select file</Button>
      </FileField>
    </FileDropZone>
  )),
  refCase("LightBoxGallery", "div", (ref) => (
    <LightBoxGallery ref={ref}>{[<span key="1">Item</span>]}</LightBoxGallery>
  )),
  refCase("Message", "article", (ref) => <Message ref={ref}>Message</Message>),
  refCase("MessageThread", "ul", (ref) => <MessageThread ref={ref} />),
  refCase("NavigationGroup (collapsable)", "div", (ref) => (
    <NavigationGroup ref={ref} collapsable>
      <Label>Group</Label>
    </NavigationGroup>
  )),
];

test.each(cases)("$name attaches its ref", async ({ setup, tagName }) => {
  const { ref, element } = setup();

  await render(element);

  expect(ref.current?.tagName).toBe(tagName);
});
