import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import type { ReactElement } from "react";
import { SkeletonMode } from "@/components/SkeletonMode";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icon";
import { IconDomain } from "@/components/Icon/components/icons";
import { Image } from "@/components/Image";
import { Initials } from "@/components/Initials";
import { Badge } from "@/components/Badge";
import { CounterBadge } from "@/components/CounterBadge";
import { AlertBadge } from "@/components/AlertBadge";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { MenuItem } from "@/components/MenuItem";
import avatarStyles from "@/components/Avatar/Avatar.module.scss";
import iconStyles from "@/components/Icon/Icon.module.scss";
import imageStyles from "@/components/Image/Image.module.scss";
import initialsStyles from "@/components/Initials/Initials.module.scss";
import badgeStyles from "@/components/Badge/Badge.module.scss";
import counterBadgeStyles from "@/components/CounterBadge/CounterBadge.module.scss";
import alertBadgeStyles from "@/components/AlertBadge/AlertBadge.module.scss";
import buttonStyles from "@/components/Button/Button.module.scss";
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

const bars = () => all(barStyles.skeletonTextContent);
const skeletonTexts = () => all(skeletonTextStyles.skeletonText);

const surfaceClassNames = {
  Avatar: avatarStyles.skeleton,
  Icon: iconStyles.skeleton,
  Image: imageStyles.skeleton,
  Initials: initialsStyles.skeleton,
  Badge: badgeStyles.skeleton,
  CounterBadge: counterBadgeStyles.skeleton,
  AlertBadge: alertBadgeStyles.skeleton,
  Button: buttonStyles.skeleton,
};

const surfaces = () =>
  Object.values(surfaceClassNames).flatMap((className) => all(className));

test("every visual component renders as an inert surface", async () => {
  await render(
    <SkeletonMode>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Icon>
        <IconDomain />
      </Icon>
      <Image src="/screenshot.png" alt="Screenshot" />
      <Initials>Max Mustermann</Initials>
      <Badge>PHP 8.4</Badge>
      <CounterBadge count={3} />
      <AlertBadge status="warning">Läuft bald ab</AlertBadge>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  for (const [component, className] of Object.entries(surfaceClassNames)) {
    if (component === "Button") {
      continue;
    }
    const surface = one(className);
    expect(surface.hasAttribute("inert"), component).toBe(true);
  }

  expect(bars()).toHaveLength(0);
  expect(skeletonTexts()).toHaveLength(0);
});

const sizeCases: Record<string, ReactElement> = {
  Avatar: (
    <Avatar size="l">
      <Initials>Max Mustermann</Initials>
    </Avatar>
  ),
  Icon: (
    <Icon size="l">
      <IconDomain />
    </Icon>
  ),
  Initials: <Initials>Max Mustermann</Initials>,
  Badge: <Badge>PHP 8.4</Badge>,
  "Badge with close button": <Badge onClose={() => undefined}>Tag</Badge>,
  CounterBadge: <CounterBadge count={128} />,
  AlertBadge: <AlertBadge status="warning">Läuft bald ab</AlertBadge>,
  Button: <Button>Speichern</Button>,
  "small outline Button": (
    <Button size="s" variant="outline">
      Abbrechen
    </Button>
  ),
  "icon Button": (
    <Button variant="plain" aria-label="Domain">
      <IconDomain />
    </Button>
  ),
  CopyButton: <CopyButton text="p-4711" />,
  "Link styled as a Button": (
    <Link href="/">
      <Button>Zum Projekt</Button>
    </Link>
  ),
};

test.each(Object.entries(sizeCases))(
  "a skeleton %s keeps its real size",
  async (_, ui) => {
    await render(
      <>
        <div data-testid="real" style={{ display: "flex" }}>
          {ui}
        </div>
        <div data-testid="skeleton" style={{ display: "flex" }}>
          <SkeletonMode>{ui}</SkeletonMode>
        </div>
      </>,
    );

    await expect.element(status()).toBeInTheDocument();

    const size = (testId: string) => {
      const element = page.getByTestId(testId).element().lastElementChild;
      if (!element) {
        throw new Error(`Nothing rendered in ${testId}`);
      }
      const { width, height } = element.getBoundingClientRect();
      return { width: Math.round(width), height: Math.round(height) };
    };

    expect(size("real").width).toBeGreaterThan(0);
    expect(size("skeleton")).toEqual(size("real"));
  },
);

test("an Avatar keeps its size, is round and renders no content", async () => {
  await render(
    <SkeletonMode>
      <Avatar size="l">
        <Image src="/avatar.png" alt="Max Mustermann" />
      </Avatar>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const avatar = one(avatarStyles.skeleton);

  expect(avatar.childElementCount).toBe(0);
  expect(document.querySelector("img")).toBeNull();

  const { width, height } = avatar.getBoundingClientRect();
  expect(width).toBeGreaterThan(0);
  expect(width).toBe(height);
  expect(getComputedStyle(avatar).borderRadius).not.toBe("0px");
});

test("an Icon renders a square in icon size and no svg", async () => {
  await render(
    <SkeletonMode>
      <Icon size="l">
        <IconDomain />
      </Icon>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const icon = one(iconStyles.skeleton);

  expect(document.querySelector("svg")).toBeNull();

  const { width, height } = icon.getBoundingClientRect();
  expect(width).toBeGreaterThan(0);
  expect(width).toBe(height);
});

test("an Image renders no <img> and is sized by width and height", async () => {
  await render(
    <SkeletonMode>
      <Image src="/screenshot.png" alt="Screenshot" width={240} height={80} />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const image = one(imageStyles.skeleton);

  expect(document.querySelector("img")).toBeNull();
  expect(image.getBoundingClientRect().width).toBe(240);
  expect(image.getBoundingClientRect().height).toBe(80);
});

test("an Image without dimensions fills the width in 16:9", async () => {
  await render(
    <div style={{ width: 320 }}>
      <SkeletonMode>
        <Image src="/screenshot.png" alt="Screenshot" />
      </SkeletonMode>
    </div>,
  );

  await expect.element(status()).toBeInTheDocument();
  const { width, height } = one(imageStyles.skeleton).getBoundingClientRect();

  expect(document.querySelector("img")).toBeNull();
  expect(width).toBe(320);
  expect(height).toBe(180);
});

test("an Image with only a height takes the width from the aspect ratio", async () => {
  await render(
    <SkeletonMode>
      <Image src="/screenshot.png" alt="Screenshot" height={90} />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const { width, height } = one(imageStyles.skeleton).getBoundingClientRect();

  expect(width).toBe(160);
  expect(height).toBe(90);
});

test("the Text inside a surface draws no second bar", async () => {
  await render(
    <SkeletonMode>
      <Button>
        <Icon>
          <IconDomain />
        </Icon>
        <Text>Domain hinzufügen</Text>
      </Button>
      <Badge>
        <Text>PHP 8.4</Text>
      </Badge>
      <AlertBadge status="danger">Fehlgeschlagen</AlertBadge>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(surfaces()).toHaveLength(3);
  expect(bars()).toHaveLength(0);
  expect(skeletonTexts()).toHaveLength(0);
  expect(all(iconStyles.skeleton)).toHaveLength(0);
});

test("buttons are inert and not focusable", async () => {
  await render(
    <>
      <SkeletonMode>
        <Button>Speichern</Button>
        <CopyButton text="ssh://p-4711@ssh.example-domain.de" />
        <Link href="/">
          <Button>Zum Projekt</Button>
        </Link>
      </SkeletonMode>
      {/* WebKit skips buttons on Tab, a text input is always tabbable. */}
      <input aria-label="After" />
    </>,
  );

  await expect.element(status()).toBeInTheDocument();

  const buttons = all(buttonStyles.skeleton);
  expect(buttons).toHaveLength(3);
  for (const button of buttons) {
    expect(button.closest("[inert]")).toBe(button);
  }

  await userEvent.tab();
  await expect.element(page.getByRole("textbox")).toHaveFocus();
});

test("a Link styled as a Button is one button surface without a bar", async () => {
  await render(
    <SkeletonMode>
      <Link href="/">
        <Button>Zum Projekt</Button>
      </Link>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(one(buttonStyles.skeleton).tagName).toBe("SPAN");
  expect(surfaces()).toHaveLength(1);
  expect(bars()).toHaveLength(0);
  expect(document.querySelector("a")).toBeNull();
});

test("a ContextMenu trigger cannot open its menu", async () => {
  await render(
    <SkeletonMode>
      <ContextMenuTrigger>
        <Button>Aktionen</Button>
        <ContextMenu>
          <MenuItem>Löschen</MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  const trigger = one(buttonStyles.skeleton);
  expect(trigger.hasAttribute("inert")).toBe(true);

  /* `force` skips the actionability check, the pointer still hits the page
     where the trigger is. */
  await userEvent.click(trigger, { force: true });

  await expect.element(page.getByRole("menu")).not.toBeInTheDocument();
});

test("buttons and badges tunnelled next to a Heading become surfaces", async () => {
  await render(
    <SkeletonMode>
      <Heading>
        Webshop Relaunch
        <Badge>Neu</Badge>
        <Button>Bearbeiten</Button>
        <AlertBadge status="warning">Speicher fast voll</AlertBadge>
      </Heading>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(bars().map((bar) => bar.textContent)).toEqual(["Webshop Relaunch"]);
  expect(one(badgeStyles.skeleton).hasAttribute("inert")).toBe(true);
  expect(one(buttonStyles.skeleton).hasAttribute("inert")).toBe(true);
  expect(one(alertBadgeStyles.skeleton).hasAttribute("inert")).toBe(true);
});

test("buttons tunnelled next to a Label become surfaces", async () => {
  await render(
    <SkeletonMode>
      <Label>
        Speicherplatz
        <Button>Erweitern</Button>
      </Label>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(bars().map((bar) => bar.textContent)).toEqual(["Speicherplatz"]);
  expect(one(buttonStyles.skeleton).hasAttribute("inert")).toBe(true);
});

test("a nested isEnabled={false} renders real, operable buttons", async () => {
  await render(
    <SkeletonMode>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <SkeletonMode isEnabled={false}>
        <Button>Speichern</Button>
        <Image src="/screenshot.png" alt="Screenshot" />
      </SkeletonMode>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();

  expect(surfaces()).toHaveLength(1);
  expect(document.querySelector("img")).not.toBeNull();

  await userEvent.tab();
  await expect
    .element(page.getByRole("button", { name: "Speichern" }))
    .toHaveFocus();
});

test("outside SkeletonMode nothing changes", async () => {
  await render(
    <>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Icon>
        <IconDomain />
      </Icon>
      <Image src="/screenshot.png" alt="Screenshot" />
      <Badge>PHP 8.4</Badge>
      <CounterBadge count={3} />
      <AlertBadge status="warning">Läuft bald ab</AlertBadge>
      <Button>Speichern</Button>
    </>,
  );

  await expect
    .element(page.getByRole("button", { name: "Speichern" }))
    .toBeInTheDocument();

  expect(surfaces()).toHaveLength(0);
  expect(document.querySelectorAll("[inert]")).toHaveLength(0);
  expect(document.querySelector("img")).not.toBeNull();
  expect(document.querySelector("svg")).not.toBeNull();
});
