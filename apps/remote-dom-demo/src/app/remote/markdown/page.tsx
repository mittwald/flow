"use client";

import {
  Heading,
  Label,
  Markdown,
  MarkdownEditor,
  Section,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <Markdown>
        The **Death Star** is fully operational and moving toward the *Endor*
        system, guarded by the ***entire Imperial fleet***.
      </Markdown>

      <Heading>Editor with file upload</Heading>

      <MarkdownEditor accept="image/*" uploadFile={uploadFile}>
        <Label>Message</Label>
      </MarkdownEditor>
    </Section>
  );
}

/*
 * Runs inside the extension: the host serializes the dropped, pasted or picked
 * File across the connection and awaits what this returns. The size goes into
 * the link text to show the file arrived whole, not just its name.
 */
const uploadFile = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    url: "https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg",
    name: `${file.name} (${file.size} bytes)`,
  };
};
