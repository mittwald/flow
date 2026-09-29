import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import type { ReactNode } from "react";
import { SkeletonMode } from "@/components/SkeletonMode";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import { Section } from "@/components/Section";
import { Alert } from "@/components/Alert";
import { AlertIcon } from "@/components/AlertIcon";
import { AlertText } from "@/components/AlertText";
import { Message } from "@/components/Message";
import { MessageThread } from "@/components/MessageThread";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { Notification } from "@/components/Notification";
import { Activity } from "@/components/Activity";
import { Rating } from "@/components/Rating";
import { Legend, LegendItem } from "@/components/Legend";
import { ProgressBar } from "@/components/ProgressBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import barStyles from "./components/SkeletonTextContent/SkeletonTextContent.module.scss";
import surfaceStyles from "./components/SkeletonIconSurface/SkeletonIconSurface.module.scss";
import tabListStyles from "@/components/Tabs/components/TabList/TabList.module.scss";
import progressBarStyles from "@/components/ProgressBar/ProgressBar.module.scss";
import legendItemStyles from "@/components/Legend/components/LegendItem/LegendItem.module.scss";
import ratingStyles from "@/components/Rating/Rating.module.scss";

const status = () => page.getByRole("status");

/**
 * The text of every rendered bar — hidden copies (e.g. `display: none`)
 * excluded.
 */
const bars = () =>
  [...document.querySelectorAll(`.${barStyles.skeletonTextContent}`)]
    .filter(
      (bar) =>
        bar.getClientRects().length > 0 &&
        window.getComputedStyle(bar).visibility !== "hidden",
    )
    .map((bar) => bar.textContent);

/**
 * `Text emulateBoldWidth` renders its content twice, the second copy invisible
 * and bold, so a bar around it carries the label twice.
 */
const emulatedBold = (label: string) => `${label}${label}`;

const iconSurfaceSelector = `.${surfaceStyles.skeletonIconSurface}`;

const iconSurfaces = () => document.querySelectorAll(iconSurfaceSelector);

/** Guards bare DOM queries: throws instead of reading `null` silently. */
const query = (selector: string, root: ParentNode = document): HTMLElement => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`No element matches "${selector}"`);
  }
  return element;
};

const queryAll = (selector: string) => [
  ...document.querySelectorAll<HTMLElement>(selector),
];

/** The first two matches, e.g. the current and another navigation item. */
const queryPair = (selector: string): [HTMLElement, HTMLElement] => {
  const [first, second] = queryAll(selector);
  if (!first || !second) {
    throw new Error(`Fewer than two elements match "${selector}"`);
  }
  return [first, second];
};

const renderSkeleton = async (children: ReactNode) => {
  const screen = await render(
    <>
      <SkeletonMode>{children}</SkeletonMode>
      {/* WebKit skips buttons and links on Tab, a text input is always tabbable. */}
      <input aria-label="After" />
    </>,
  );
  await expect.element(status()).toBeInTheDocument();
  return screen;
};

/** Tabbing from the start of the page lands on the input behind the skeleton. */
const expectNothingFocusable = async () => {
  await userEvent.tab();
  await expect.element(page.getByRole("textbox")).toHaveFocus();
};

const style = (element: Element, pseudoElement?: string) =>
  window.getComputedStyle(element, pseudoElement);

/* Navigation */

test("Navigation items become inert bars without a current item", async () => {
  await renderSkeleton(
    <Navigation aria-label="Projekt">
      <Link href="#" aria-current="page">
        Übersicht
      </Link>
      <Link href="#">Domains</Link>
      <NavigationGroup>
        <Label>Hosting</Label>
        <Link href="#">Datenbanken</Link>
      </NavigationGroup>
    </Navigation>,
  );

  expect(bars()).toEqual(["Übersicht", "Domains", "Hosting", "Datenbanken"]);
  expect(document.querySelector("nav")?.hasAttribute("inert")).toBe(false);
  expect(document.querySelectorAll("a")).toHaveLength(0);
  expect(document.querySelectorAll("[aria-current]")).toHaveLength(0);

  const [current, other] = queryPair("nav li > span");
  expect(current.hasAttribute("inert")).toBe(true);
  expect(style(current).backgroundColor).toBe(style(other).backgroundColor);
  expect(style(current).fontWeight).toBe(style(other).fontWeight);

  await expectNothingFocusable();
});

test("HeaderNavigation items become inert bars without an underline", async () => {
  await renderSkeleton(
    <HeaderNavigation aria-label="Hauptnavigation">
      <Link href="#" aria-current="page">
        Projekte
      </Link>
      <Link href="#">Organisationen</Link>
    </HeaderNavigation>,
  );

  expect(bars()).toEqual([
    emulatedBold("Projekte"),
    emulatedBold("Organisationen"),
  ]);
  expect(document.querySelectorAll("[aria-current]")).toHaveLength(0);

  const [current, other] = queryPair("nav li > span");
  expect(current.hasAttribute("inert")).toBe(true);
  expect(style(current).fontWeight).toBe(style(other).fontWeight);
  expect(style(current, "::after").content).toBe("none");

  await expectNothingFocusable();
});

test("TabNavigation items and the more menu are inert", async () => {
  await renderSkeleton(
    <TabNavigation aria-label="Projekt">
      <Link href="#" aria-current="page">
        Übersicht
      </Link>
      <Link href="#">Backups</Link>
    </TabNavigation>,
  );

  expect(bars()).toEqual([emulatedBold("Übersicht"), emulatedBold("Backups")]);
  expect(document.querySelectorAll("[aria-current]")).toHaveLength(0);

  const [current, other] = queryPair("nav li > span");
  expect(current.hasAttribute("inert")).toBe(true);
  expect(style(current).backgroundColor).toBe(style(other).backgroundColor);
  expect(query("nav > div").hasAttribute("inert")).toBe(true);

  await expectNothingFocusable();
});

test("Breadcrumb items become inert bars without a current item", async () => {
  await renderSkeleton(
    <Breadcrumb>
      <Link href="#">Projekte</Link>
      <Link href="#">Webshop Relaunch</Link>
    </Breadcrumb>,
  );

  expect(bars()).toEqual(["Projekte", "Webshop Relaunch"]);

  const [first, last] = queryPair("ol li > span");
  expect(last.hasAttribute("inert")).toBe(true);
  expect(style(last).fontWeight).toBe(style(first).fontWeight);

  await expectNothingFocusable();
});

/* Tabs */

const tabs = (
  <Tabs aria-label="Einstellungen">
    <Tab id="general">
      <TabTitle>Allgemein</TabTitle>
      <Section>
        <Text>Projektname</Text>
      </Section>
    </Tab>
    <Tab id="backups">
      <TabTitle>Backups</TabTitle>
      <Section>
        <Text>Backup-Zeitplan</Text>
      </Section>
    </Tab>
  </Tabs>
);

test("the Tabs tab list is inert and shows no selected tab", async () => {
  await renderSkeleton(tabs);

  expect(bars()).toEqual(["Allgemein", "Backups", "Projektname"]);
  expect(query(`.${tabListStyles.tabList}`).hasAttribute("inert")).toBe(true);
  expect(
    document.querySelector(`.${tabListStyles.activeIndicator}`),
  ).toBeNull();

  const [selected, other] = queryPair("[role=tab]");
  expect(selected.getAttribute("aria-selected")).toBe("true");
  expect(style(selected).fontWeight).toBe(style(other).fontWeight);

  /*
   * The tab panel is a container and stays as it is: react-aria makes a panel
   * without tabbable content focusable, in the real UI too.
   */
  await userEvent.tab();
  await expect.element(page.getByRole("tabpanel")).toHaveFocus();
  await expectNothingFocusable();
});

test("a click on a skeleton tab does not switch the tab", async () => {
  await renderSkeleton(tabs);

  const [, other] = queryPair("[role=tab]");
  await userEvent.click(other, { force: true });

  expect(other.getAttribute("aria-selected")).toBe("false");
  expect(bars()).toContain("Projektname");
  expect(bars()).not.toContain("Backup-Zeitplan");
});

/* Status */

test("Alert keeps its container and drops the status color", async () => {
  await renderSkeleton(
    <>
      <Alert status="danger">
        <Heading>Zertifikat abgelaufen</Heading>
        <Content>Die Domain ist nicht mehr per HTTPS erreichbar.</Content>
      </Alert>
      <Alert status="success">
        <Heading>Backup erstellt</Heading>
      </Alert>
    </>,
  );

  expect(bars()).toEqual([
    "Zertifikat abgelaufen",
    "Die Domain ist nicht mehr per HTTPS erreichbar.",
    "Backup erstellt",
  ]);

  const [danger, success] = queryPair("aside");
  expect(danger.hasAttribute("inert")).toBe(false);
  expect(style(danger).borderInlineStartColor).toBe(
    style(success).borderInlineStartColor,
  );
});

test("AlertIcon becomes an inert round surface in icon size", async () => {
  await renderSkeleton(
    <>
      <AlertIcon status="danger" />
      <AlertText status="warning">Das Zertifikat läuft bald ab.</AlertText>
    </>,
  );

  expect(iconSurfaces()).toHaveLength(2);

  const [standalone, inAlertText] = queryPair(iconSurfaceSelector);
  const icon = query("svg", standalone);
  expect(standalone.hasAttribute("inert")).toBe(true);
  expect(style(standalone).borderRadius).toBe("50%");
  expect(standalone.getBoundingClientRect().width).toBe(
    icon.getBoundingClientRect().width,
  );
  expect(standalone.getBoundingClientRect().height).toBe(
    icon.getBoundingClientRect().height,
  );
  expect(style(icon).visibility).toBe("hidden");

  expect(query("svg", inAlertText).getBoundingClientRect().width).toBeLessThan(
    icon.getBoundingClientRect().width,
  );
});

test("Notification renders its content without a link", async () => {
  await renderSkeleton(
    <>
      <Notification status="danger" onClick={() => undefined}>
        <Heading>Backup fehlgeschlagen</Heading>
        <Text>Das Backup von p-4711 konnte nicht erstellt werden.</Text>
      </Notification>
      <Notification status="success">
        <Heading>Backup erstellt</Heading>
      </Notification>
    </>,
  );

  expect(bars()).toEqual([
    "Backup fehlgeschlagen",
    "Das Backup von p-4711 konnte nicht erstellt werden.",
    "Backup erstellt",
  ]);
  expect(document.querySelectorAll("a")).toHaveLength(0);

  const [danger, success] = queryPair("[role=alert]");
  expect(style(danger, "::after").backgroundColor).toBe(
    style(success, "::after").backgroundColor,
  );

  await expectNothingFocusable();
});

test("Message, MessageThread and IllustratedMessage keep their containers", async () => {
  await renderSkeleton(
    <>
      <MessageThread>
        <Message type="sender">
          <Content>Wann wird das Backup wiederhergestellt?</Content>
        </Message>
        <Message color="rebeccapurple">
          <Content>
            <Text>Heute Abend.</Text>
          </Content>
        </Message>
      </MessageThread>
      <IllustratedMessage color="danger">
        <AlertIcon status="danger" />
        <Heading>Keine Domains</Heading>
        <Text>Füge deine erste Domain hinzu.</Text>
      </IllustratedMessage>
    </>,
  );

  expect(bars()).toEqual([
    "Wann wird das Backup wiederhergestellt?",
    "Heute Abend.",
    "Keine Domains",
    "Füge deine erste Domain hinzu.",
  ]);
  expect(iconSurfaces()).toHaveLength(1);
  expect(queryAll("[inert] [inert]")).toHaveLength(0);
  expect(query("ul").hasAttribute("inert")).toBe(false);
  expect(query("article, li").hasAttribute("inert")).toBe(false);
});

test("Activity passes the mode on", async () => {
  await renderSkeleton(
    <Activity>
      <Text>Projektname</Text>
    </Activity>,
  );

  expect(bars()).toEqual(["Projektname"]);
});

test("Rating becomes an inert surface", async () => {
  await renderSkeleton(<Rating aria-label="Bewertung" defaultValue={3} />);

  const rating = query("[role=radiogroup]");
  expect(rating.hasAttribute("inert")).toBe(true);

  const segments = query(`.${ratingStyles.ratingSegments}`);
  expect(style(segments).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(style(query("svg")).visibility).toBe("hidden");

  await expectNothingFocusable();
});

test("Legend markers become surfaces without their color", async () => {
  await renderSkeleton(
    <Legend>
      <LegendItem color="sea-green">Webspace</LegendItem>
      <LegendItem color="#ff0000">Datenbanken</LegendItem>
    </Legend>,
  );

  expect(bars()).toEqual(["Webspace", "Datenbanken"]);

  const [categorical, custom] = queryPair(`.${legendItemStyles.colorSquare}`);
  expect(categorical.style.backgroundColor).toBe("");
  expect(custom.style.backgroundColor).toBe("");
  expect(style(categorical).backgroundColor).toBe(
    style(custom).backgroundColor,
  );
  expect(categorical.closest("li")?.hasAttribute("inert")).toBe(true);
});

test("ProgressBar shows its track without a fill and hides the value", async () => {
  await renderSkeleton(
    <ProgressBar value={72} status="danger">
      <Label>Speicherplatz</Label>
    </ProgressBar>,
  );

  expect(bars()).toEqual(["Speicherplatz"]);

  const progressBar = query("[role=progressbar]");
  expect(progressBar.hasAttribute("inert")).toBe(true);
  expect(document.querySelector(`.${progressBarStyles.fill}`)).toBeNull();
  expect(style(query(`.${progressBarStyles.value}`)).visibility).toBe("hidden");
  expect(style(query(`.${progressBarStyles.bar}`)).boxShadow).toBe("none");
});

test("LoadingSpinner becomes a round surface that does not spin", async () => {
  await renderSkeleton(<LoadingSpinner size="l" />);

  const surface = query(iconSurfaceSelector);
  const icon = query("svg", surface);

  expect(surface.hasAttribute("inert")).toBe(true);
  expect(style(surface).borderRadius).toBe("50%");
  expect(style(icon).animationName).toBe("none");
  expect(surface.getBoundingClientRect().width).toBe(
    icon.getBoundingClientRect().width,
  );
});

/* Opt-out and outside the mode */

test("a nested isEnabled={false} keeps navigation and tabs operable", async () => {
  await render(
    <SkeletonMode>
      <Text>Projekt wird geladen</Text>
      <SkeletonMode isEnabled={false}>
        <Tabs aria-label="Einstellungen">
          <Tab id="general">
            <TabTitle>Allgemein</TabTitle>
            <Text>Projektname</Text>
          </Tab>
        </Tabs>
        <Navigation aria-label="Projekt">
          <Link href="#" aria-current="page">
            Übersicht
          </Link>
        </Navigation>
        <AlertIcon status="info" />
      </SkeletonMode>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(bars()).toEqual(["Projekt wird geladen"]);
  expect(iconSurfaces()).toHaveLength(0);

  await userEvent.tab();
  await expect
    .element(page.getByRole("tab", { name: "Allgemein" }))
    .toHaveFocus();
  await expect
    .element(page.getByRole("link", { name: "Übersicht" }))
    .toHaveAttribute("aria-current");
});

test("outside the mode, status components render unchanged", async () => {
  await render(
    <>
      <AlertIcon status="danger" />
      <LoadingSpinner />
      <ProgressBar value={40} aria-label="Speicherplatz" />
    </>,
  );

  await expect.element(page.getByRole("progressbar")).toBeInTheDocument();
  expect(iconSurfaces()).toHaveLength(0);
  expect(document.querySelector(`.${progressBarStyles.fill}`)).not.toBeNull();
  expect(query("[role=progressbar]").hasAttribute("inert")).toBe(false);
});
