# ADR 0002 – Stylesheet-Generierung und CSS-Authoring

- **Status:** Accepted (rückwirkend dokumentiert)
- **Datum:** 2026-07-07
- **Deciders:** Flow-Team (m.falkenberg@mittwald.de)
- **Betrifft:** `@mittwald/flow-react-components`, `@mittwald/flow-stylesheet`,
  `@mittwald/flow-design-tokens`

> Dieses ADR beschreibt den **Ist-Zustand** der Stylesheet-Erzeugung. Es wurde
> nachträglich verfasst, um die bereits etablierte Architektur als
> Entscheidungsgrundlage festzuhalten — u. a. als Kontext für
> [ADR 0001 (CSS Cascade Layers)](./0001-css-cascade-layers-im-stylesheet.md).

## Kontext

Flow braucht ein ausgeliefertes CSS-Artefakt, das Consumer einbinden können, plus
ein Authoring-Modell, mit dem ~118 Komponenten wartbar gestylt werden. Dieses ADR
hält fest, welche Werkzeuge und Konventionen dafür im Einsatz sind und wie das
finale Stylesheet zustande kommt.

## Entscheidung / Architektur

### 1. Komponenten-Authoring: CSS Modules + Sass

- Styles werden pro Komponente in `*.module.scss` geschrieben (~114 Dateien;
  daneben 3 `*.module.css`).
- Klassennamen werden über einen **eigenen Scoped-Name-Generator**
  (`packages/components/dev/vite/cssModuleClassNameGenerator.ts`) auf ein
  `flow--*`-Präfix abgebildet, abgeleitet vom Komponenten-Pfad:
  - `components/Button` + Klasse `.button` → `.flow--button`
  - `components/RadioGroup/components/Radio` → `.flow--radio-group--radio`
- Sass-Features (`@use`, `@forward`, `@mixin`) sind in Gebrauch; Mixins liegen
  unter `packages/components/src/styles/mixins/`.
- React-Aria-Hooks werden über `:global(.react-aria-*)`-Selektoren gestylt (siehe
  z. B. `Calendar.module.scss`, `TimeField.module.scss`).

### 2. Foundation-Ebene

`packages/components/src/styles/index.scss` bündelt die globale Grundlage in
definierter Reihenfolge:

1. Design-Tokens: `@forward "@mittwald/flow-design-tokens/css/base.css"`,
   `colors-light.css`, `colors-dark.css`
2. System-Preference-Farben via `@media (prefers-color-scheme)` +
   `meta.load-css(...)`
3. `@forward "./fonts"` (`@font-face`)
4. `@forward "./globals"` (globaler Reset, u. a. `all: initial`)

### 3. Design-Tokens: Style Dictionary → CSS Custom Properties

- Paket `@mittwald/flow-design-tokens`, Build via Style Dictionary
  (`packages/design-tokens/build-tokens.js`).
- Quelle: YAML-Definitionen (`color-palette.yml`, `size.yml`, `effects.yml`, …).
- Output: mehrere theme-spezifische CSS-Dateien (`base.css`, `colors-light.css`,
  `colors-dark.css`, System-Varianten, kombinierte `all-*.css`).
- Custom-Transform `name/flow-css-var`: Token `button.padding-y` →
  `--button--padding-y`. Tokens sind also durchgängig **CSS Custom Properties**.

### 4. Bundling: Vite (Rollup) im Library-Modus

Konfiguration: `packages/components/vite.build.config.ts` (+ Basis
`vite.config.ts`).

- Mehrere Lib-Entries (`default`, `internal`, `flr-universal`, Integrationen,
  `globals`), Format `es`, `preserveModules: true`.
- CSS-Preprocessing über Sass; CSS-Module-Scoping über den Custom-Generator
  (`vite.config.ts`, `css.modules.generateScopedName`).
- CSS-Minifizierung via **esbuild** (`cssMinify: "esbuild"`).
- Asset-Mapping in `rollupOptions.output.assetFileNames`:
  - `flow-react-components.css` → `dist/css/all.css`
  - `globals.css` → `dist/css/globals.css` *(Mapping vorhanden, wird beim
    Auslieferungs-Build aber derzeit nicht als eigenes Asset erzeugt — siehe
    unten)*
- **Kein** explizites PostCSS-Setup (keine `postcss.config.*`). `postcss`,
  `postcss-nesting`, `postcss-nested-import` liegen in den devDependencies, Sass
  ist der primäre Präprozessor.

### 5. Auslieferung

- Der Auslieferungs-Build erzeugt **ein einziges** CSS-Artefakt:
  `dist/css/all.css` (~390 KB). Es enthält **alles** — Component-Styles,
  Token-Definitionen (`:root`, u. a. 756 `--color--*`-Deklarationen), `@font-face`
  und den `all: initial`-Reset. Ein separates `globals.css` wird beim
  Auslieferungs-Build **nicht** erzeugt.
- `@mittwald/flow-react-components` exportiert es als `./all.css`
  (`exports` in `package.json`).
- `@mittwald/flow-stylesheet` re-exportiert es unverändert: `build.js` kopiert
  `@mittwald/flow-react-components/all.css` nach `dist/styles.css` und exportiert
  es als `./css`.

### 6. Cascade-Modell (Ist-Zustand)

- **Keine** CSS Cascade Layers (`@layer`).
- Tatsächliche Reihenfolge im gebauten `all.css` (per Byte-Offset verifiziert):
  1. **Component-Module-Styles** (ab Byte 17)
  2. **Token-`:root`-Definitionen** (ab ~Byte 270k)
  3. **`@font-face` + globaler `all: initial`-Reset** (~Byte 373k, am Ende)

  Also *Komponenten → Tokens → Fonts/Reset* — nicht Foundation-zuerst. Das
  funktioniert, weil CSS Custom Properties unabhängig von der Quell-Reihenfolge
  aufgelöst werden.
- Vorrang entscheidet sich damit faktisch über **Spezifität** (das `flow--*`-
  Präfix), **nicht** über die Quell-Reihenfolge. → Dies ist der Ausgangspunkt
  für [ADR 0001](./0001-css-cascade-layers-im-stylesheet.md).

### 7. React Aria

`react-aria-components` (^1.19) liefert nur Verhalten/Markup, **kein CSS**, und
ist im Build externalisiert (`externalizeDeps`). Es entsteht daher kein
Third-Party-CSS im ausgelieferten Bundle.

## Konsequenzen

- **Wartbarkeit:** Klare Trennung Tokens ↔ Foundation ↔ Komponenten; Styles leben
  neben ihrer Komponente. Scoped Naming verhindert Kollisionen.
- **Ein Artefakt:** Consumer binden ein einzelnes CSS ein — einfache Integration.
- **Kein Layer-Vorrangmodell:** Overrides hängen von Spezifität ab (Motivation
  für ADR 0001).
- **Tooling-Abhängigkeit:** Der Build stützt sich auf Vites Sass-/CSS-Module-
  Pipeline und ein maßgeschneidertes Asset-Renaming; Änderungen daran wirken
  direkt auf `all.css`.

## Verifiziert per lokalem Build

Ein lokaler `npx nx build components` und die Inspektion von `dist/css/` haben
bestätigt: Es entsteht **genau eine** Datei, `all.css`, die Tokens, Fonts, Reset
und Komponenten in der oben beschriebenen Reihenfolge enthält. Es gibt beim
Auslieferungs-Build **kein** getrenntes Foundation-Asset. Das ist maßgeblich für
die Umsetzung von [ADR 0001](./0001-css-cascade-layers-im-stylesheet.md): Da
Foundation und Komponenten in einem gemergten File liegen (Foundation teils sogar
*nach* den Komponenten), lässt sich die Sublayer-Struktur **nicht** durch ein
Wrapping getrennter Assets erreichen.
