---
since: 0.2.0-alpha.977
title: Tabs restyled; navigation usage moves to TabNavigation
kind: migration
action: manual
remotePackage: true
apply: >-
  Tabs' rendering changed: the tab list now fills the available width with
  equal-size tabs and a shared, animated indicator that slides between them,
  replacing the previous fit-content tabs that each carried their own
  hover/pressed/selected background. Nothing else about `Tabs` changed, and a
  `Tabs` that switches content within a page needs no code change — the new look
  applies on upgrade. Where `Tabs` was used to fake real navigation instead — a
  `TabTitle` given an `href` (`Aria.Tab`'s routing props: `href`, `target`,
  `routerOptions`, …) so selecting it pushed a real route change — replace it
  with `TabNavigation`: plain `Link` children instead of
  `Tab`/`TabTitle`/panels, `aria-current="page"` on the active `Link` instead of
  `selectedKey`/`defaultSelectedKey`/`onSelectionChange`. `TabNavigation` keeps
  the visual language the old `Tabs` used to have, because it now owns that use
  case.
---

`Tabs` restyled: the tab list now fills the available width with equal-size tabs
and a shared, animated indicator that slides between them, instead of the
previous fit-content tabs that each carried their own hover/pressed/selected
background. Nothing else about `Tabs` changed — same props, same panels, same
collapsing behavior. If `Tabs` switches content within a page, there is nothing
to do; the new look applies on upgrade.

**Real navigation has a proper home now.** React Aria's `Tab` (which `TabTitle`
extends) accepts the same routing props as a plain link — `href`, `target`,
`routerOptions`, … — so a `Tabs` could always double as a navigation control:
give a `TabTitle` an `href` and selecting it pushed a real route change while
the row still looked and behaved like tabs otherwise. That usage only reached
for `Tabs` because nothing else looked right for it. Now there is
`TabNavigation`, introduced in the same version specifically for this case — and
it keeps the visual language the old `Tabs` used to have.

```diff
- <Tabs selectedKey={pathname}>
-   <Tab id="/apps">
-     <TabTitle href="/apps">Apps</TabTitle>
-   </Tab>
-   <Tab id="/container">
-     <TabTitle href="/container">Container</TabTitle>
-   </Tab>
- </Tabs>
+ <TabNavigation aria-label="Projekt-Navigation">
+   <Link href="/apps" aria-current={pathname === "/apps" ? "page" : undefined}>
+     Apps
+   </Link>
+   <Link
+     href="/container"
+     aria-current={pathname === "/container" ? "page" : undefined}
+   >
+     Container
+   </Link>
+ </TabNavigation>
```

#### What moves and what doesn't

**The children.** `Tab` / `TabTitle` / the panel disappear; `TabNavigation`
takes plain `Link` children directly. There is no panel, because the destination
page's content lives on that route, not inside the component.

**The active state.** `selectedKey` / `defaultSelectedKey` / `onSelectionChange`
have no counterpart — `TabNavigation` does not track selection itself. Each
`Link` marks itself current with `aria-current="page"`, which the app's router
already knows how to derive (e.g. from the current pathname), the same way it
would for any other navigation link.

**Status icons.** An `AlertIcon` moves from inside `TabTitle` to inside the
`Link`.

**Collapsing.** The two do this differently. `Tabs` collapses all at once: as
soon as any tab stops fitting, the whole tab list turns into a single button
showing the active tab, which opens every tab in a context menu. `TabNavigation`
collapses incrementally: links are hidden one by one as space runs out, and only
those that no longer fit move into the "More" button's menu — the rest stay
visible as ordinary links.

There is no codemod: only the surrounding code knows whether a given `Tabs`
usage was real navigation (an `href` on `TabTitle`, or a route push from
`onSelectionChange`) or a genuine content switcher that merely looked similar
before this change — the two are indistinguishable from the source alone.
