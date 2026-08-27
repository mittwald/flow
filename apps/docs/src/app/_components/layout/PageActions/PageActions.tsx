"use client";

import type { FC } from "react";
import {
  Action,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  ActionGroup,
  Icon,
  IconContextMenuVertical,
  IconCopy,
  IconExternalLink,
  MenuItem,
} from "@mittwald/flow-react-components";
import { IconBrandGithub } from "@tabler/icons-react";
import {
  IconBrandChatGpt,
  IconBrandClaude,
} from "@/app/_components/layout/PageActions/brandIcons";
import {
  absoluteUrl,
  chatGptPromptUrl,
  claudePromptUrl,
} from "@/lib/llms/siteUrls";

interface Props {
  title: string;
  markdownUrl: string;
  gitHubUrl?: string;
}

const copyMarkdown = async (markdownUrl: string): Promise<void> => {
  const markdown = fetch(markdownUrl).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Could not load ${markdownUrl}`);
    }
    return await response.text();
  });

  if (typeof ClipboardItem === "function") {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": markdown.then(
          (text) => new Blob([text], { type: "text/plain" }),
        ),
      }),
    ]);
    return;
  }

  await navigator.clipboard.writeText(await markdown);
};

export const PageActions: FC<Props> = (props) => {
  const { title, markdownUrl, gitHubUrl } = props;

  const prompt = `Lies ${absoluteUrl(markdownUrl)} und beantworte mir anschließend Fragen zu „${title}“ aus der Dokumentation des mittwald Design Systems Flow.`;

  return (
    <ActionGroup preserveOrder>
      <Action onAction={() => copyMarkdown(markdownUrl)}>
        <Button size="s" variant="outline" color="secondary">
          Seite kopieren
          <IconCopy />
        </Button>
      </Action>
      <ContextMenuTrigger>
        <Button
          size="s"
          variant="outline"
          color="secondary"
          aria-label="Weitere Aktionen"
        >
          <IconContextMenuVertical />
        </Button>
        <ContextMenu placement="bottom right">
          <MenuItem href={markdownUrl} target="_blank">
            <IconExternalLink />
            Markdowndatei öffnen
          </MenuItem>
          <MenuItem href={claudePromptUrl(prompt)} target="_blank">
            <Icon>
              <IconBrandClaude />
            </Icon>
            In Claude öffnen
          </MenuItem>
          <MenuItem href={chatGptPromptUrl(prompt)} target="_blank">
            <Icon>
              <IconBrandChatGpt />
            </Icon>
            In ChatGPT öffnen
          </MenuItem>
          {gitHubUrl && (
            <MenuItem href={gitHubUrl} target="_blank">
              <Icon>
                <IconBrandGithub />
              </Icon>
              Quellcode anzeigen
            </MenuItem>
          )}
        </ContextMenu>
      </ContextMenuTrigger>
    </ActionGroup>
  );
};

export default PageActions;
