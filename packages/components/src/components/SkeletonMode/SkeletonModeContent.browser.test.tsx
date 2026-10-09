import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import type { ReactElement } from "react";
import { SkeletonMode } from "@/components/SkeletonMode";
import { Kbd } from "@/components/Kbd";
import { FileDropZone } from "@/components/FileDropZone";
import { FileField } from "@/components/FileField";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeEditor } from "@/components/CodeEditor";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Markdown } from "@/components/Markdown";
import { ImageCropper } from "@/components/ImageCropper";
import { CartesianChart, Bar, XAxis, YAxis } from "@/components/CartesianChart";
import { DonutChart } from "@/components/DonutChart";
import { Calendar, RangeCalendar } from "@/components/Calendar";
import { AvatarStack } from "@/components/AvatarStack";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { FileCard } from "@/components/FileCard";
import { FileCardList } from "@/components/FileCardList";
import { Chat } from "@/components/Chat";
import { Message } from "@/components/Message";
import { MessageThread } from "@/components/MessageThread";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Popover, PopoverTrigger } from "@/components/Popover";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { LightBox, LightBoxTrigger } from "@/components/LightBox";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { CoachMark } from "@/components/CoachMark";
import {
  List,
  ListItem,
  ListItemView,
  ListStaticData,
} from "@/components/List";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { Image } from "@/components/Image";
import { IconUpload } from "@/components/Icon/components/icons";
import { useOverlayController } from "@/lib/controller";
import kbdStyles from "@/components/Kbd/Kbd.module.scss";
import fileDropZoneStyles from "@/components/FileDropZone/FileDropZone.module.scss";
import codeBlockStyles from "@/components/CodeBlock/CodeBlock.module.scss";
import codeEditorStyles from "@/components/CodeEditor/CodeEditor.module.scss";
import markdownEditorStyles from "@/components/MarkdownEditor/MarkdownEditor.module.scss";
import imageCropperStyles from "@/components/ImageCropper/ImageCropper.module.scss";
import cartesianChartStyles from "@/components/CartesianChart/CartesianChart.module.scss";
import donutChartStyles from "@/components/DonutChart/DonutChart.module.scss";
import calendarStyles from "@/components/Calendar/Calendar.module.scss";
import avatarStyles from "@/components/Avatar/Avatar.module.scss";
import buttonStyles from "@/components/Button/Button.module.scss";
import modalStyles from "@/components/Modal/Modal.module.scss";
import barStyles from "./components/SkeletonTextContent/SkeletonTextContent.module.scss";
import skeletonTextStyles from "@/components/SkeletonText/SkeletonText.module.scss";

const status = () => page.getByRole("status");

const all = (className: string) =>
  [...document.querySelectorAll(`.${className}`)] as HTMLElement[];

/**
 * Throws when the element is missing, so a check for absence can't pass on a
 * DOM that has not rendered yet.
 */
const one = (className: string) => {
  const [element, ...others] = all(className);
  if (!element || others.length > 0) {
    throw new Error(`Expected one .${className}, got ${others.length + 1}`);
  }
  return element;
};

/** The element at `index`, throwing when there is none. */
const at = <T,>(items: T[], index: number): T => {
  const item = items[index];
  if (item === undefined) {
    throw new Error(`Nothing at index ${index}`);
  }
  return item;
};

const bars = () => all(barStyles.skeletonTextContent);
const barTexts = () => bars().map((bar) => bar.textContent);
const skeletonTexts = () => all(skeletonTextStyles.skeletonText);

const size = (element: Element) => {
  const { width, height } = element.getBoundingClientRect();
  return { width: Math.round(width), height: Math.round(height) };
};

const code = `server {
  listen 443 ssl;
  server_name example-domain.de;
}`;

/** A loadable image, so the real cropper renders its slider. */
const createImage = (): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  canvas.getContext("2d")?.fillRect(0, 0, 100, 100);
  return canvas.toDataURL("image/png");
};

const chartData = [
  { month: "Juli", requests: 1200 },
  { month: "August", requests: 1800 },
];

const chart = (
  <CartesianChart data={chartData} height="200px">
    <XAxis dataKey="month" />
    <YAxis />
    <Bar dataKey="requests" />
  </CartesianChart>
);

interface SurfaceCase {
  className: string;
  ui: ReactElement;
}

const surfaceCases: Record<string, SurfaceCase> = {
  Kbd: {
    className: kbdStyles.skeleton,
    ui: <Kbd keys={["mod", "c"]} variant="soft" />,
  },
  "plain Kbd": { className: kbdStyles.skeleton, ui: <Kbd>Esc</Kbd> },
  FileDropZone: {
    className: fileDropZoneStyles.skeleton,
    ui: (
      <FileDropZone>
        <IconUpload />
        <Heading>Datei hochladen</Heading>
        <Text>Ziehe die Datei hierher.</Text>
        <FileField name="file">
          <Button>Datei auswählen</Button>
        </FileField>
      </FileDropZone>
    ),
  },
  CodeBlock: {
    className: codeBlockStyles.skeleton,
    ui: <CodeBlock code={code} />,
  },
  "CodeBlock with children": {
    className: codeBlockStyles.skeleton,
    ui: <CodeBlock>{code}</CodeBlock>,
  },
  ImageCropper: {
    className: imageCropperStyles.skeleton,
    ui: <ImageCropper image={createImage()} width={240} height={160} />,
  },
  Calendar: { className: calendarStyles.skeleton, ui: <Calendar /> },
  RangeCalendar: {
    className: calendarStyles.skeleton,
    ui: <RangeCalendar aria-label="Zeitraum" />,
  },
};

test.each(Object.entries(surfaceCases))(
  "a skeleton %s is one inert surface in its real size",
  async (_, { className, ui }) => {
    await render(
      <>
        <div data-testid="real" style={{ display: "flex" }}>
          {ui}
        </div>
        <div data-testid="skeleton" style={{ display: "flex" }}>
          <SkeletonMode>{ui}</SkeletonMode>
        </div>
        <input aria-label="After" />
      </>,
    );

    await expect.element(status()).toBeInTheDocument();

    const surface = one(className);
    expect(surface.closest("[inert]")).not.toBeNull();

    /* The content draws no skeleton of its own. */
    expect(bars()).toHaveLength(0);
    expect(skeletonTexts()).toHaveLength(0);
    expect(all(buttonStyles.skeleton)).toHaveLength(0);

    const real = page.getByTestId("real").element().lastElementChild;
    const skeleton = page.getByTestId("skeleton").element().lastElementChild;
    if (!real || !skeleton) {
      throw new Error("Nothing rendered");
    }
    expect(size(real).width).toBeGreaterThan(0);
    await expect.poll(() => size(skeleton)).toEqual(size(real));

    /* Nothing inside the surface takes the focus. */
    for (const element of skeleton.querySelectorAll("*")) {
      expect(element.closest("[inert]")).not.toBeNull();
    }
  },
);

test("a CodeBlock mounts its editor only to keep the size", async () => {
  await render(
    <SkeletonMode>
      <CodeBlock code={code} copyable />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const surface = one(codeBlockStyles.skeleton);

  expect(surface.hasAttribute("inert")).toBe(true);
  expect(
    getComputedStyle(at([...surface.querySelectorAll(".cm-content")], 0))
      .visibility,
  ).toBe("hidden");
});

test("a CodeEditor renders a surface as high as its code and no CodeMirror", async () => {
  const editor = (
    <CodeEditor value={code}>
      <Label>Konfiguration</Label>
    </CodeEditor>
  );

  await render(
    <>
      <div data-testid="real">{editor}</div>
      <div data-testid="skeleton">
        <SkeletonMode>{editor}</SkeletonMode>
      </div>
    </>,
  );

  await expect.element(status()).toBeInTheDocument();

  const skeleton = page.getByTestId("skeleton").element();
  const real = page.getByTestId("real").element();

  expect(skeleton.querySelector(".cm-editor")).toBeNull();
  expect(skeleton.querySelector("[contenteditable]")).toBeNull();
  expect(barTexts()).toHaveLength(1);
  expect(barTexts()[0]).toContain("Konfiguration");

  const surface = one(codeEditorStyles.skeleton);
  expect(surface.closest("[inert]")).not.toBeNull();

  const realEditor = real.querySelector(`.${codeEditorStyles.codeMirror}`);
  if (!realEditor) {
    throw new Error("No real editor");
  }
  await expect.poll(() => size(surface)).toEqual(size(realEditor));
});

test("a CodeEditor with a height keeps it", async () => {
  await render(
    <SkeletonMode>
      <CodeEditor value="" height="240px" aria-label="Konfiguration" />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const surface = one(codeEditorStyles.skeleton);
  const lines = one(codeEditorStyles.skeletonLines);

  expect(size(lines).height).toBe(240);
  expect(size(surface).height).toBeGreaterThan(240);
});

test("a MarkdownEditor is one surface over toolbar and text area", async () => {
  const editor = (
    <MarkdownEditor value="**Hallo**" rows={4}>
      <Label>Beschreibung</Label>
    </MarkdownEditor>
  );

  await render(
    <>
      <div data-testid="skeleton">
        <SkeletonMode>{editor}</SkeletonMode>
      </div>
      <input aria-label="After" />
      <div data-testid="real">{editor}</div>
    </>,
  );

  await expect.element(status()).toBeInTheDocument();

  const skeleton = page.getByTestId("skeleton").element();
  const real = page.getByTestId("real").element();
  const surface = one(markdownEditorStyles.skeletonSurface);

  expect(one(markdownEditorStyles.skeleton).hasAttribute("inert")).toBe(true);
  expect(barTexts()).toHaveLength(1);
  expect(barTexts()[0]).toContain("Beschreibung");
  expect(all(buttonStyles.skeleton)).toHaveLength(0);

  const toolbar = real.querySelector(`.${markdownEditorStyles.toolbar}`);
  const textArea = real.querySelector("textarea");
  if (!toolbar || !textArea) {
    throw new Error("No real editor");
  }
  expect(size(surface)).toEqual({
    width: size(toolbar).width,
    height: size(toolbar).height + size(textArea).height,
  });
  expect(size(skeleton)).toEqual(size(real));

  await userEvent.tab();
  await expect
    .element(page.getByRole("textbox", { name: "After" }))
    .toHaveFocus();
});

test("charts render no svg and keep their size", async () => {
  await render(
    <div style={{ width: 600 }}>
      <SkeletonMode>
        {chart}
        <CartesianChart data={chartData}>
          <Bar dataKey="requests" />
        </CartesianChart>
        <DonutChart value={40} aria-label="Speicherplatz" />
        <DonutChart
          value={40}
          size="l"
          segments={[
            { title: "Datenbanken", value: 30 },
            { title: "Dateien", value: 10 },
          ]}
        />
      </SkeletonMode>
    </div>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(document.querySelector("svg")).toBeNull();
  expect(document.querySelector(".recharts-wrapper")).toBeNull();
  expect(document.querySelector("[role='progressbar']")).toBeNull();

  const charts = all(cartesianChartStyles.skeleton);
  const withHeight = at(charts, 0);
  const withAspect = at(charts, 1);
  expect(size(withHeight)).toEqual({ width: 600, height: 200 });
  expect(size(withAspect)).toEqual({ width: 600, height: 200 });

  const donuts = all(donutChartStyles.skeleton);
  const donutM = at(donuts, 0);
  const donutL = at(donuts, 1);
  expect(size(donutM)).toEqual({ width: 128, height: 128 });
  expect(size(donutL)).toEqual({ width: 192, height: 192 });
  expect(getComputedStyle(donutM).borderRadius).not.toBe("0px");

  for (const surface of [withHeight, withAspect, donutM, donutL]) {
    expect(surface.hasAttribute("inert")).toBe(true);
  }

  /* The legend follows the text rule of its items. */
  expect(barTexts()).toEqual(["Datenbanken (30 %)", "Dateien (10 %)"]);
});

test("an ImageCropper loads no image", async () => {
  await render(
    <SkeletonMode>
      <ImageCropper image="/avatar.png" />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const surface = one(imageCropperStyles.skeleton);

  expect(surface.hasAttribute("inert")).toBe(true);
  expect(document.querySelector("img")).toBeNull();
  expect(document.querySelector(".reactEasyCrop_Container")).toBeNull();
  expect(size(surface).width).toBe(300);
});

test("AvatarStack, FileCard and FileCardList follow their parts", async () => {
  await render(
    <SkeletonMode>
      <AvatarStack totalCount={5} onCountPress={() => undefined}>
        <Avatar>
          <Initials>Max Mustermann</Initials>
        </Avatar>
        <Avatar>
          <Initials>Erika Musterfrau</Initials>
        </Avatar>
      </AvatarStack>
      <FileCardList>
        <FileCard
          name="rechnung-2026-09.pdf"
          type="application/pdf"
          sizeInBytes={123456}
          href="/rechnung-2026-09.pdf"
          onDelete={() => undefined}
        />
      </FileCardList>
      <input aria-label="After" />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  /* two avatars, the count avatar is inside the count button's surface */
  expect(all(avatarStyles.skeleton)).toHaveLength(3);
  /* the count button and the delete button */
  expect(all(buttonStyles.skeleton)).toHaveLength(2);
  expect(barTexts()).toEqual(["rechnung-2026-09.pdf", "123KB"]);
  expect(document.querySelector("a")).toBeNull();

  await userEvent.tab();
  await expect
    .element(page.getByRole("textbox", { name: "After" }))
    .toHaveFocus();
});

test("Markdown renders its blocks as bars and surfaces", async () => {
  await render(
    <SkeletonMode>
      <Markdown>
        {[
          "# Domain umziehen",
          "Stelle den **Nameserver** um.",
          "- Zone exportieren\n- Zone importieren\n  - Einträge prüfen",
          "1. Nameserver ändern",
          "> Die Umstellung dauert bis zu 24 Stunden.",
          "```\ndig example-domain.de\n```",
          "| Eintrag | Wert |\n| --- | --- |\n| A | 192.0.2.10 |",
        ].join("\n\n")}
      </Markdown>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(barTexts()).toEqual([
    "Domain umziehen",
    "Stelle den Nameserver um.",
    "Zone exportieren",
    "Zone importieren",
    "Einträge prüfen",
    "Nameserver ändern",
    "Die Umstellung dauert bis zu 24 Stunden.",
    "Eintrag",
    "Wert",
    "A",
    "192.0.2.10",
  ]);
  one(codeBlockStyles.skeleton);

  /* A bar in a list is visible and as wide as its text. */
  for (const bar of bars()) {
    expect(getComputedStyle(bar).visibility).toBe("visible");
    expect(size(bar).width).toBeGreaterThan(0);
  }
});

test("Markdown outside SkeletonMode renders its lists unchanged", async () => {
  await render(
    <Markdown>{"- [x] Zone exportieren\n- Zone importieren"}</Markdown>,
  );

  await expect.element(page.getByText("Zone importieren")).toBeInTheDocument();

  const items = [...document.querySelectorAll("li")];
  expect(items).toHaveLength(2);
  expect(at(items, 0).className).toBe("task-list-item");
  expect(at(items, 1).innerHTML).toBe("Zone importieren");
  expect(bars()).toHaveLength(0);
});

test("an image in Markdown issues no request", async () => {
  await render(
    <SkeletonMode>
      <Markdown>{"Das Logo:\n\n![mittwald](/logo.png)"}</Markdown>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  await expect.poll(() => barTexts()).toContain("Das Logo:");
  expect(document.querySelector("img")).toBeNull();
});

test("the messages of a Chat become bars", async () => {
  await render(
    <SkeletonMode>
      <Chat height={400}>
        <MessageThread>
          <Message>
            <Header>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>Max Mustermann</Text>
            </Header>
            <Content>
              <Text>Das Zertifikat wurde verlängert.</Text>
            </Content>
          </Message>
        </MessageThread>
      </Chat>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(barTexts()).toEqual([
    "Max Mustermann",
    "Das Zertifikat wurde verlängert.",
  ]);
  expect(all(avatarStyles.skeleton)).toHaveLength(1);
});

test("the items of a List follow the rules of their content", async () => {
  await render(
    <SkeletonMode>
      <List aria-label="Domains">
        <ListStaticData
          data={[
            { hostname: "example-domain.de" },
            { hostname: "shop.example-domain.de" },
          ]}
        />
        <ListItem<{ hostname: string }> textValue={(d) => d.hostname}>
          {(domain) => (
            <ListItemView>
              <Avatar>
                <Initials>{domain.hostname}</Initials>
              </Avatar>
              <Heading>{domain.hostname}</Heading>
              <Text>Domain</Text>
            </ListItemView>
          )}
        </ListItem>
      </List>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  await expect.poll(() => all(avatarStyles.skeleton)).toHaveLength(2);

  expect(barTexts()).toEqual(
    expect.arrayContaining([
      "example-domain.de",
      "Domain",
      "shop.example-domain.de",
    ]),
  );
});

test("the cells and columns of a Table become bars", async () => {
  await render(
    <SkeletonMode>
      <Table aria-label="Domains">
        <TableHeader>
          <TableColumn>Domain</TableColumn>
          <TableColumn>Zertifikat</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>example-domain.de</TableCell>
            <TableCell>
              <Text>Gültig bis 12.01.2027</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowHeader>shop.example-domain.de</TableCell>
            <TableCell>{42}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(barTexts()).toEqual([
    "Domain",
    "Zertifikat",
    "example-domain.de",
    "Gültig bis 12.01.2027",
    "shop.example-domain.de",
    "42",
  ]);
});

const Opener = () => <Button>Öffnen</Button>;

const overlayCases: Record<string, ReactElement> = {
  Modal: (
    <ModalTrigger>
      <Opener />
      <Modal>
        <Heading>Domain bearbeiten</Heading>
      </Modal>
    </ModalTrigger>
  ),
  Popover: (
    <PopoverTrigger>
      <Opener />
      <Popover>
        <Text>Popover-Inhalt</Text>
      </Popover>
    </PopoverTrigger>
  ),
  LightBox: (
    <LightBoxTrigger>
      <Opener />
      <LightBox>
        <Image src="/screenshot.png" alt="Screenshot" />
      </LightBox>
    </LightBoxTrigger>
  ),
  ContextualHelp: (
    <ContextualHelpTrigger>
      <Opener />
      <ContextualHelp>
        <Text>Hilfe-Inhalt</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  ),
};

test.each(Object.entries(overlayCases))(
  "a skeleton trigger cannot open a %s",
  async (_, ui) => {
    await render(<SkeletonMode>{ui}</SkeletonMode>);

    await expect.element(status()).toBeInTheDocument();
    const trigger = one(buttonStyles.skeleton);
    expect(trigger.hasAttribute("inert")).toBe(true);

    /* `force` skips the actionability check, the pointer still hits the page
       where the trigger is. */
    await userEvent.click(trigger, { force: true });

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  },
);

test("a skeleton trigger cannot open a Tooltip", async () => {
  await render(
    <>
      <button>Neutral</button>
      <SkeletonMode>
        <TooltipTrigger>
          <Button aria-label="Domain">
            <IconUpload />
          </Button>
          <Tooltip>Domain hinzufügen</Tooltip>
        </TooltipTrigger>
      </SkeletonMode>
    </>,
  );

  await expect.element(status()).toBeInTheDocument();
  const trigger = one(buttonStyles.skeleton);

  /* A hover only counts once the pointer modality is set. */
  await userEvent.click(page.getByRole("button", { name: "Neutral" }));
  await userEvent.hover(trigger, { force: true });
  await new Promise((resolve) => setTimeout(resolve, 800));

  await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument();
});

test("a controlled open Modal renders its content as skeleton", async () => {
  await render(
    <SkeletonMode>
      <Modal isDefaultOpen showCloseButton>
        <Heading>Domain bearbeiten</Heading>
        <Content>
          <Text>Die Domain wird auf das neue Projekt umgezogen.</Text>
        </Content>
        <ActionGroup>
          <Button color="secondary" variant="soft">
            Abbrechen
          </Button>
          <Button>Speichern</Button>
        </ActionGroup>
      </Modal>
    </SkeletonMode>,
  );

  await expect.element(page.getByRole("dialog")).toBeInTheDocument();

  expect(barTexts()).toEqual([
    "Domain bearbeiten",
    "Die Domain wird auf das neue Projekt umgezogen.",
  ]);
  expect(all(buttonStyles.skeleton)).toHaveLength(2);

  /* Title and close button stay side by side in the header row, the title
     as a bar in its text width, the close button as an inert surface. */
  const dialog = page.getByRole("dialog").element();
  const title = one(modalStyles.headerTitle);
  const close = one(modalStyles.closeButton);

  for (const element of [title, close]) {
    expect(getComputedStyle(element).visibility).toBe("visible");
    expect(getComputedStyle(element).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)",
    );
  }
  expect(size(title).width).toBeGreaterThan(0);
  expect(size(title).width).toBeLessThan(size(dialog).width / 2);
  expect(close.getBoundingClientRect().top).toBeLessThan(
    title.getBoundingClientRect().bottom,
  );
  expect(close.closest("[inert]")).not.toBeNull();

  /* A loading modal still closes with Escape. */
  await userEvent.keyboard("{Escape}");
  await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
});

test("an open CoachMark renders its content as skeleton", async () => {
  const Fixture = () => {
    const controller = useOverlayController("CoachMark", {
      isDefaultOpen: true,
    });

    return (
      <>
        <button id="anchor">Anker</button>
        <SkeletonMode>
          <CoachMark anchor="anchor" controller={controller}>
            <Heading>Neu: Backups</Heading>
            <Text>Backups lassen sich jetzt planen.</Text>
          </CoachMark>
        </SkeletonMode>
      </>
    );
  };

  await render(<Fixture />);

  await expect.element(page.getByText("Neu: Backups")).toBeInTheDocument();
  expect(barTexts()).toEqual([
    "Neu: Backups",
    "Backups lassen sich jetzt planen.",
  ]);
});

test("a nested isEnabled={false} renders real editors and charts", async () => {
  await render(
    <SkeletonMode>
      <SkeletonMode isEnabled={false}>
        <CodeEditor value={code} aria-label="Konfiguration" />
        {chart}
        <DonutChart value={40} aria-label="Speicherplatz" />
        <Kbd>Esc</Kbd>
      </SkeletonMode>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  await expect.poll(() => document.querySelector(".cm-editor")).not.toBeNull();
  await expect
    .poll(() => document.querySelectorAll("svg").length)
    .toBeGreaterThan(0);
  expect(document.querySelectorAll("[inert]")).toHaveLength(0);
});

test("outside SkeletonMode nothing changes", async () => {
  await render(
    <>
      <Kbd>Esc</Kbd>
      <CodeBlock code={code} />
      <CodeEditor value={code} aria-label="Konfiguration" />
      <MarkdownEditor aria-label="Beschreibung" />
      {chart}
      <DonutChart value={40} aria-label="Speicherplatz" />
      <RangeCalendar aria-label="Zeitraum" />
      <Table aria-label="Domains">
        <TableHeader>
          <TableColumn>Domain</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>example-domain.de</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>,
  );

  await expect
    .element(page.getByRole("rowheader", { name: "example-domain.de" }))
    .toBeInTheDocument();
  await expect
    .poll(() => document.querySelectorAll(".cm-editor").length)
    .toBe(2);

  expect(document.querySelectorAll("[inert]")).toHaveLength(0);
  expect(document.querySelector("[class*='skeleton']")).toBeNull();
  expect(document.querySelector("[role='progressbar']")).not.toBeNull();
});

test("a truncated text shows no ellipsis over its bar", async () => {
  await render(
    <div style={{ width: 240 }}>
      <SkeletonMode>
        <FileCard
          name="rechnung-2026-09-webshop-relaunch-mittwald.pdf"
          type="application/pdf"
        />
      </SkeletonMode>
    </div>,
  );

  await expect
    .poll(() => document.querySelector("[class*=skeleton-text-content]"))
    .toBeTruthy();

  const bar = document.querySelector("[class*=skeleton-text-content]");
  let truncating = bar?.parentElement;
  while (truncating && getComputedStyle(truncating).whiteSpace !== "nowrap") {
    truncating = truncating.parentElement;
  }
  if (!truncating) {
    throw new Error("No truncating ancestor found");
  }
  expect(getComputedStyle(truncating).textOverflow).toBe("clip");
});
