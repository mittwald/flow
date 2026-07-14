# ADR 0001 – CSS Cascade Layers im generierten Stylesheet

- **Status:** Accepted
- **Datum:** 2026-07-07
- **Deciders:** Flow-Team (m.falkenberg@mittwald.de)
- **Betrifft:** `@mittwald/flow-react-components` (`./all.css`), `@mittwald/flow-stylesheet`

## Kontext und Problemstellung

> Die zugrundeliegende Build-Architektur ist in
> [ADR 0002 (Stylesheet-Generierung)](./0002-stylesheet-generierung.md)
> dokumentiert.

Flow liefert sein CSS als ein gebündeltes Stylesheet aus. Komponenten werden in
~114 `*.module.scss`-Dateien (CSS Modules + Sass) geschrieben und von Vite/Rollup
zu einem Artefakt gebündelt (`dist/css/all.css`), das `@mittwald/flow-stylesheet`
unverändert re-exportiert. Die Foundation-Ebene (Design-Tokens als CSS Custom
Properties, `@font-face`, ein globaler Reset mit `all: initial` in
`globals.scss`) entsteht aus `src/styles/index.scss` als eigener Build-Zweig.

Aktuell nutzt Flow **keine** CSS Cascade Layers (`@layer`). Welche Regel gewinnt,
entscheidet sich allein über **Spezifität + Quell-Reihenfolge**. Flow verlässt
sich auf ein Präfix-Naming (`.flow--*`), das eine relativ hohe, aber nicht
kontrollierbare Spezifität erzeugt.

Daraus folgen zwei wiederkehrende Probleme:

1. **Consumer-Overrides sind mühsam.** Wer eine Flow-Komponente anpassen will,
   muss Flows Spezifität überbieten (verschachtelte Selektoren, `!important`).
   Das ist fragil und bricht bei internen Flow-Änderungen.
2. **Keine deterministische Ebenen-Trennung.** Foundation (Tokens/Reset) und
   Komponenten konkurrieren im selben, flachen Cascade-Raum. Es gibt keinen
   sprachlich garantierten Vorrang.

React Aria Components liefern **kein eigenes CSS** — Flow stylt deren
data-/Klassen-Hooks selbst. Es gibt also aus dieser Richtung keinen
Third-Party-CSS-Konflikt zu berücksichtigen.

## Entscheidungstreiber

- **Überschreibbarkeit ohne Spezifitäts-Kampf** für Consumer.
- **Deterministische, sprachlich garantierte Ebenen-Ordnung** innerhalb von Flow
  (Tokens vor Reset vor Komponenten).
- **Minimale Invasivität** in den ~114 SCSS-Quellen.
- **Interop** mit Consumer-Setups, insbesondere Tailwind v4 (nutzt selbst
  `@layer`).
- **Browser-Support** muss zur Support-Matrix von Flow passen.

## Betrachtete Optionen

### Option A — Status quo (keine Layers)

Kein Eingriff. Cascade weiter über Spezifität + Reihenfolge.

- ➕ Kein Aufwand, kein Bruch.
- ➖ Löst keines der beiden Probleme. Override-Schmerz bleibt.

### Option B — Ein einziger Layer `@layer flow`

Das gesamte gebündelte CSS in einen Layer wrappen.

- ➕ Einfachster Kontrakt; Consumer-Overrides werden trivial.
- ➕ Post-Build in einem Schritt umsetzbar.
- ➖ Keine interne Ebenen-Trennung; Foundation und Komponenten bleiben im selben
  Layer.

### Option C — Verschachtelte Sublayers `@layer flow.tokens, flow.reset, flow.base, flow.components` *(gewählt)*

Ein Top-Level-Layer `flow` mit definierter Sub-Reihenfolge.

- ➕ Consumer-Overrides trivial (wie B).
- ➕ Deterministische interne Ordnung: Tokens → Base/Reset → Komponenten.
- ➕ Consumer können bei Bedarf gezielt zwischen Ebenen eingreifen.
- ➖ Etwas mehr Build-Logik; die Sub-Grenzen müssen aus der bestehenden
  Foundation-/Komponenten-Trennung abgeleitet werden.

## Entscheidung

Flow wrappt sein generiertes Stylesheet in **verschachtelte CSS Cascade Layers**
unter einem Top-Level-Layer `flow`:

```css
@layer flow.tokens, flow.reset, flow.base, flow.components;
```

- **`flow.tokens`** — Design-Token-Deklarationen (CSS Custom Properties). Werden
  **bewusst mit-gelayert**, damit Consumer Tokens ohne Spezifitäts-Tricks
  überschreiben können.
- **`flow.reset`** — der globale Reset aus `globals.scss` (`all: initial`,
  `prefers-reduced-motion`, `display`-Reverts, Basis-Typografie-Defaults,
  `color-scheme`). Eigener, unterster Style-Layer, damit der Reset weder
  Komponenten noch Consumer-Styles unbeabsichtigt überschreibt.
- **`flow.base`** — `@font-face` (aus `fonts.scss`) und künftige globale
  Base-Styles.
- **`flow.components`** — alle Component-Module-Styles.

Die Reihenfolge ist bewusst: Reset ganz unten (nur Werte-Tokens davor), dann
Base, dann Komponenten. Da `globals.scss` bereits ausschließlich Reset-Regeln
enthält (Fonts liegen getrennt in `fonts.scss`), lässt sich `flow.reset` die
Datei als Ganzes zuordnen — kein Schnitt innerhalb einer Datei nötig.

Weitere Festlegungen:

- **Nur Flow-eigene Layer.** Flow deklariert und dokumentiert **keine**
  layer-Reihenfolge relativ zu Consumer-Layern (z. B. Tailwind). Consumer
  positionieren ihre eigenen Layer selbst. Flow gibt lediglich zu, dass sein CSS
  vollständig unter `flow.*` liegt.
- **Umsetzung in-place an der Quelle.** Die ~114 `*.module.scss` bleiben
  unangetastet. Die Sublayer werden an ihrer jeweiligen Quelle zugewiesen
  (Token-Build, `index.scss`, PostCSS-Plugin für Komponenten) und eine
  Reihenfolgen-Deklaration wird an den Anfang des gemergten `all.css` gehoben —
  keine getrennten Dateien, kein Assembly-Schritt. Siehe „Umsetzung".
- **Rollout als harter Breaking Change** für den Default `all.css` im nächsten
  Alpha-Release; zusätzlich eine **ungelayerte Opt-out-Variante** als eigener
  Export (siehe „Rollout & Migration").

## Konsequenzen

### Positiv

- Consumer überschreiben jede Flow-Regel mit **ungelayertem** CSS — unabhängig
  von Spezifität, ohne `!important`.
- Flows interne Cascade ist sprachlich garantiert: Komponenten schlagen die Base,
  die Base schlägt Tokens — egal wie Rollup die Dateien konkateniert.
- Zukunftssicher für granularere Consumer-Kontrolle, ohne heute einen
  Consumer-Kontrakt festzuschreiben.

### Negativ / Risiken

- **Verhaltensbruch bei Overrides.** Gelayertes CSS verliert grundsätzlich gegen
  ungelayertes. Consumer, die sich bisher darauf verließen, dass Flow ihre
  globalen Styles/Resets *überschreibt*, bekommen Regressionen. Beispiel: ein
  globales, ungelayertes `button { background: red }` verlor früher gegen
  `.flow--button` und gewinnt jetzt.
- **Reset-Wechselwirkung.** Der `all: initial`-Reset liegt im untersten Style-
  Layer `flow.reset` und verliert damit gegen ungelayerte Consumer-Resets sowie
  gegen alle anderen Flow-Layer. Das ist konsistent mit dem Modell, muss aber in
  der Migration explizit genannt werden. Positiver Nebeneffekt: die heute nötige
  Feinsteuerung der Reset-Spezifität (durchgängig 0-0-2 via `:where()`) wird
  weniger kritisch, da Komponenten den Reset schon per Layer-Reihenfolge schlagen.
- **Browser-Support.** `@layer` ist unterstützt ab Chrome/Edge 99, Firefox 97,
  Safari 15.4 (alle ~Q1 2022, global >96 %). In Browsern ohne Support wird die
  gesamte `@layer`-Regel **ignoriert** — das Flow-CSS würde dort *gar nicht*
  greifen. Flow pflegt **keine** offizielle Browser-Support-Matrix; damit gilt die
  `@layer`-Baseline (~Q1 2022) als faktische Untergrenze. Das wird als akzeptabel
  bewertet, da alle relevanten Evergreen-Browser dieses Feature seit Jahren
  unterstützen.
- **Tooling.** Minifier/Bundler müssen `@layer` erhalten. esbuild (aktueller
  `cssMinify`) und Lightning CSS tun das; vor Release verifizieren.

## Rollout & Migration

Da Flow ausdrücklich in `0.2.x-alpha` **ohne Stabilitätsgarantie** steht, wird das
**Standard-Stylesheet hart umgestellt**: `all.css` ist künftig gelayert. Als
**Opt-out** wird zusätzlich eine **ungelayerte Variante** ausgeliefert (siehe
„Ungelayerte Variante" unten) — damit ist der Umstieg nicht erzwungen, ohne die
gelayerte Default-Variante zu verwässern.

- Layering wird im nächsten Alpha-Bump für `all.css` **standardmäßig aktiv**; das
  bestehende `all.css` wird direkt durch die gelayerte Variante ersetzt.
- Eintrag in `packages/components/MIGRATION.md` mit:
  - Erklärung des neuen Modells (ungelayert schlägt `flow.*`).
  - „Vorher/Nachher" für den häufigsten Fall (Override wird *einfacher* — kein
    `!important` mehr nötig).
  - Warnung für den Regressionsfall (globale Element-Styles/Resets gewinnen jetzt
    gegen Flow). **Extremfall:** ein app-weites, ungelayertes `* { all: initial }`
    überschreibt jetzt *sämtliche* Flow-Styles und lässt Komponenten ungestylt.
    Empfehlung: eigenen Reset in einen Layer *vor* `flow` legen — oder die
    ungelayerte Variante verwenden.

### Ungelayerte Variante

Für Consumer, die Cascade Layers (noch) nicht adoptieren können oder deren App
einen aggressiven, ungelayerten Reset mitbringt (`* { all: initial }`), wird eine
zusätzliche **ungelayerte** Fassung exportiert:

- `@mittwald/flow-react-components/all.unlayered.css`
- `@mittwald/flow-stylesheet/css-unlayered`

Sie entsteht aus dem gelayerten `all.css`, indem die `@layer`-Hüllen entfernt
werden (die relative Regel-Reihenfolge bleibt erhalten). Damit greift wieder das
alte, spezifitätsbasierte Verhalten: Flows `.flow--*`-Selektoren gewinnen über
generische App-Selektoren. Der Default-Export (`all.css` / `css`) bleibt gelayert.

## Umsetzung

> **Per lokalem Build verifiziert** (siehe
> [ADR 0002](./0002-stylesheet-generierung.md)): Der Auslieferungs-Build erzeugt
> **ein einziges** `all.css` mit Tokens, Fonts, Reset und Komponenten. Es gibt
> keine getrennten Foundation-/Component-Assets.

Die Sublayer werden **in-place an ihrer jeweiligen Quelle** zugewiesen — kein
Emit getrennter `flow-*.css`-Dateien, kein Assembly-Schritt. Das gemergte
`all.css` enthält die `@layer`-Blöcke verteilt; eine vorangestellte
Reihenfolgen-Deklaration fixiert die Priorität, unabhängig von der physischen
Position der Blöcke. Die ~114 `*.module.scss` bleiben unangetastet. Umgesetzt und
über `corepack pnpm --filter @mittwald/flow-react-components build` verifiziert:

1. **`flow.tokens` — Token-Build (Style Dictionary).**
   `packages/design-tokens/build-tokens.js` erzeugt die Token-CSS über **7
   Destinations** (`base`, `colors-light`, `colors-dark`, die
   `*-system`-Varianten, `all-light/-dark`) mit jeweils eigenem `:root`-Selektor.
   Ein eigenes registriertes Format `css/variables-layered` umschließt den
   `css/variables`-Output in `@layer flow.tokens { … }` (respektiert `selector` +
   `outputReferences`). Da diese Dateien via `@forward` in `index.scss`
   einfließen, wandert der Layer in `all.css`; die `:root[data-theme=…]`- bzw.
   `prefers-color-scheme`-Selektoren bleiben innerhalb des Layers erhalten.

2. **`flow.reset` / `flow.base` — `index.scss`.**
   `packages/components/src/styles/index.scss` weist Reset und Fonts über
   `@layer flow.reset { @include meta.load-css("./globals"); }` bzw.
   `@layer flow.base { @include meta.load-css("./fonts"); }` zu und deklariert die
   Reihenfolge `@layer flow.tokens, flow.reset, flow.base, flow.components;`.

3. **`flow.components` — PostCSS-Plugin.**
   `packages/components/dev/vite/flowComponentsLayerPlugin.ts` hüllt beim
   CSS-Processing jedes `*.module.(scss|css)` unter `/src/components/` in
   `@layer flow.components`. Die CSS-Module-Scoping-Pipeline von Vite bleibt
   unangetastet, da nur der geparste Root umschlossen wird (`.module.css` **und**
   `.module.scss` werden erfasst).

4. **Reihenfolgen-Deklaration — Vite-`writeBundle`.**
   esbuild (`cssMinify`) verwirft die aus `index.scss` stammende Deklaration;
   `packages/components/dev/vite/layerOrderPlugin.ts` hebt sie nach der
   Minifizierung an den Anfang von `all.css` (nach optionalem `@charset`) und
   entfernt Duplikate.

**Bewusste Konsequenz (in-place statt getrennte Dateien):** Da `all.css` ein
gemergtes Artefakt bleibt, lassen sich Token nicht ohne Weiteres separat auf
Dokumentebene ausliefern — das erschwert eine Shadow-DOM-Kapselung (Token auf
Dokument-`:root`, Komponenten im Shadow-Root, weil `:root` im Shadow-Baum nicht
matcht). Falls dieser Use-Case relevant wird, ist der Datei-pro-Layer-Ansatz
erneut abzuwägen.

**Offener technischer Punkt:** Der `writeBundle`-Rewrite verschiebt Byte-Offsets
nach der Minifizierung → die `all.css.map` ist danach leicht ungenau; für
Produktion nachziehen.

## Geklärte Punkte

Alle ursprünglich offenen Punkte sind entschieden:

1. **Browser-Support:** Es gibt keine offizielle Support-Matrix. Die
   `@layer`-Baseline (~Q1 2022) gilt als akzeptable Untergrenze.
2. **Artefakt-Realität:** Per lokalem Build bestätigt — `all.css` bleibt ein
   einziges, gemergtes Bundle (siehe „Umsetzung" /
   [ADR 0002](./0002-stylesheet-generierung.md)). Die Sublayer werden daher
   **in-place an der Quelle** zugewiesen (kein getrenntes Datei-Emit, kein
   Assembly).
3. **Escape-Hatch:** Der Default `all.css` wird hart auf gelayert umgestellt;
   zusätzlich wird eine **ungelayerte Variante** als Opt-out-Export ausgeliefert
   (`./all.unlayered.css` bzw. `./css-unlayered`) — u. a. für Apps mit
   aggressivem `* { all: initial }`-Reset (siehe „Rollout & Migration").
4. **`flow.tokens`:** Token-Deklarationen werden gelayert (Consumer können Tokens
   ohne Spezifitäts-Tricks überschreiben).

## Implementierungsstand

Ein Spike setzt die Layer um und ist über
`corepack pnpm --filter @mittwald/flow-react-components build` verifiziert (das
gebaute `all.css` beginnt mit der Order-Deklaration, alle vier Sublayer korrekt
befüllt, inkl. der drei `*.module.css`-Komponenten). Umgesetzt in:

- `packages/design-tokens/build-tokens.js` – Style-Dictionary-Format
  `css/variables-layered` hüllt die Token-CSS in `@layer flow.tokens`.
- `packages/components/src/styles/index.scss` – Reset in `@layer flow.reset`,
  Fonts in `@layer flow.base`, Order-Deklaration.
- `packages/components/dev/vite/flowComponentsLayerPlugin.ts` – PostCSS-Plugin,
  das jedes `*.module.(scss|css)` in `@layer flow.components` hüllt.
- `packages/components/dev/vite/layerOrderPlugin.ts` – Vite-`writeBundle`-Plugin,
  das die Order-Deklaration nach der Minifizierung an den Anfang von `all.css`
  hebt (esbuild verwirft sie sonst).

Der **in-place-Ansatz** (per-Modul-Wrap + Order-Hoist in einem gemergten
`all.css`) ist die beschlossene Umsetzung; der Abschnitt „Umsetzung" beschreibt
ihn. Die getrennte-Dateien-Variante ist verworfen (bleibt nur als Option für einen
späteren Shadow-DOM-Use-Case notiert, siehe „Umsetzung").

## Nächste Schritte

- Sourcemap-Genauigkeit: der `writeBundle`-Rewrite verschiebt Offsets in
  `all.css.map` – für Produktion nachziehen.
- Voll-Pipeline-Lauf in CI (`corepack pnpm nx build components` mit vollständigem
  Workspace/Codegen).
- Kosmetik: die 117 einzelnen `@layer flow.components`-Blöcke ggf. zu einem
  zusammenfassen.
- `packages/components/MIGRATION.md` ergänzt; Versions-Heading beim Release
  finalisieren.
