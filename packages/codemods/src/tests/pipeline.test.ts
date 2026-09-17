import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";
import { sortBySince } from "../catalog/select";
import { runTransform } from "./runTransform";

/**
 * Every codemod, in the order `upgrade` applies them.
 *
 * Read from the catalogue rather than listed here, so a new codemod joins this
 * chain the moment its entry exists — which is the point: what a single
 * transform does to a file is settled by its own fixtures, but what **the whole
 * catalogue** does to one is settled nowhere else. A consumer who never ran
 * this tool gets all of them, oldest first (`selectEntries` has no lower
 * bound), and the only thing that matters to them is what comes out at the
 * end.
 *
 * Two failures live in the gaps between transforms and are invisible to any
 * single fixture:
 *
 * - One transform eats what a later one needs. `imports-to-package-root` would
 *   flatten `password-tools` away before `password-tools-subpath-renamed` ever
 *   sees it, and both would report success.
 * - A transform names an entry by a spelling that is not what a consumer has **at
 *   that point in the chain**. `password-tools-rule` matched only
 *   `mittwald-password-tools-js`, the name that entry got two migrations
 *   _later_ — so `AsyncRule` went untouched and the rename afterwards carried
 *   it onto an entry that does not export it.
 */
const chain = sortBySince(
  readCatalog().filter((entry) => entry.action === "codemod"),
).map((entry) => entry.id);

interface ChainRun {
  /** The file after the last codemod. */
  source: string;
  /** The ids that changed it, in the order they ran. */
  changedBy: string[];
}

/**
 * Runs the whole chain over one file, the way `upgrade` does: every codemod,
 * oldest first, each one over what the previous one left.
 *
 * Through `runTransform` — the real jscodeshift CLI over `src/migrations` —
 * rather than `runCodemod`, although `runCodemod` is what `upgrade` itself
 * calls. `runCodemod` resolves `dist/migrations/<id>/transform.js` first and
 * only falls back to the source, so a `dist` left over from an earlier build is
 * what it measures, not the working tree. This suite ran against three-week-old
 * transforms that way on its first run. It failed loudly there; a stale build
 * that happens to agree passes just as quietly, proving nothing about the code
 * under review. `publishedTransforms.test.ts` is where the compiled artifact is
 * held to account; here the point is the source.
 *
 * A transform that throws, errors on the file, or accounts for no file at all
 * fails inside `runTransform`, naming itself, rather than surfacing as a
 * puzzling diff at the end.
 */
const runChain = (source: string): ChainRun => {
  const changedBy: string[] = [];

  const migrated = chain.reduce((current, id) => {
    const next = runTransform(id, current);
    if (next !== current) {
      changedBy.push(id);
    }
    return next;
  }, source);

  return { source: migrated, changedBy };
};

/**
 * A consumer file from before the oldest migration, written the way the API
 * looked then. Every codemod in the catalogue has something to do in it:
 *
 * | line                                     | migration                                  |
 * | ---------------------------------------- | ------------------------------------------ |
 * | `/styles`, `/styles?url`                 | `renamed-css-export`                       |
 * | `/components/*`, `/controller`           | `imports-to-package-root`                  |
 * | `action={…}`                             | `action-prop-to-on-action`                 |
 * | `SubmitButtonProps`                      | `button-props-interfaces`                  |
 * | `MutedActionError`                       | `muted-action-error-to-abort-action-error` |
 * | `AccentBox color="violet"`               | `accent-box-color-to-background-color`     |
 * | `AsyncRule`                              | `password-tools-rule`                      |
 * | `Heading color="primary"`                | `color-primary-to-default`                 |
 * | `TableColumn maxWidth`/`minWidth={null}` | `table-column-width-props`                 |
 * | `/password-tools`                        | `password-tools-subpath-renamed`           |
 * | `Button color="accent"`                  | `button-color-accent-to-success`           |
 * | `Align`                                  | `align-to-combine`                         |
 */
const legacyApp = `import "@mittwald/flow-react-components/styles";
import flowStyles from "@mittwald/flow-react-components/styles?url";
import { AccentBox } from "@mittwald/flow-react-components/components/AccentBox";
import { Action } from "@mittwald/flow-react-components/components/Action";
import { Align } from "@mittwald/flow-react-components/components/Align";
import { Button } from "@mittwald/flow-react-components/components/Button";
import { Heading } from "@mittwald/flow-react-components/components/Heading";
import { MutedActionError } from "@mittwald/flow-react-components/components/Action";
import { TableColumn } from "@mittwald/flow-react-components/components/TableColumn";
import type { OverlayController } from "@mittwald/flow-react-components/controller";
import type { SubmitButtonProps } from "@mittwald/flow-react-components/react-hook-form";
import { AsyncRule } from "@mittwald/flow-react-components/password-tools";

export class PasswordRule extends AsyncRule {}

export const stylesheet = flowStyles;

export const Toolbar = (props: {
  controller: OverlayController;
  save: SubmitButtonProps;
}) => (
  <Align>
    <Heading color="primary">Danger zone</Heading>
    <AccentBox color="violet">
      <TableColumn maxWidth={200} minWidth={null} width={120} />
    </AccentBox>
    <Action action={props.controller.close}>
      <Button color="accent">Close</Button>
    </Action>
  </Align>
);

export const aborted = (error: unknown) => error instanceof MutedActionError;
`;

/**
 * The same file against today's API. Asserted whole and inline rather than
 * snapshotted: a snapshot records whatever the chain happens to produce, and
 * the thing worth guarding here is that the result is _correct_ — every name,
 * path and prop below is one the packages export or accept today. A diff in the
 * test file is a claim a reviewer can check against the migration guide.
 */
const migratedApp = `import "@mittwald/flow-react-components/all.css";
import flowStyles from "@mittwald/flow-react-components/all.css?url";
import { AccentBox } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { Combine } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { AbortActionError } from "@mittwald/flow-react-components";
import { TableColumn } from "@mittwald/flow-react-components";
import type { OverlayController, ButtonProps } from "@mittwald/flow-react-components";
import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";

export class PasswordRule extends Rule {}

export const stylesheet = flowStyles;

export const Toolbar = (props: {
  controller: OverlayController;
  save: ButtonProps;
}) => (
  <Combine>
    <Heading color="default">Danger zone</Heading>
    <AccentBox backgroundColor="violet">
      <TableColumn width={120} />
    </AccentBox>
    <Action onAction={() => props.controller.close()}>
      <Button color="success">Close</Button>
    </Action>
  </Combine>
);

export const aborted = (error: unknown) => error instanceof AbortActionError;
`;

describe("the whole catalogue, applied in order", () => {
  test(
    "an old consumer file comes out on today's API",
    { timeout: 300_000 },
    () => {
      const run = runChain(legacyApp);

      expect(run.source).toBe(migratedApp);

      /**
       * And every codemod earned its place in that result. A transform with
       * nothing to do in the fixture still runs, but proves nothing about how
       * it composes with the rest — it is carried, not covered. Asserting the
       * full list keeps that from happening silently: a new migration has to
       * bring a line of `legacyApp` with it.
       */
      expect(run.changedBy).toEqual(chain);
    },
  );

  /**
   * Running the chain again is what a consumer does when they upgrade twice, or
   * when they run `upgrade` on a project that is already current. Each
   * transform proves its own idempotency in its fixtures; this proves they stay
   * idempotent _after each other_, which is a different claim — a transform can
   * be a no-op on its own output and still have something to say about what a
   * later one wrote.
   */
  test(
    "a second pass over the migrated file changes nothing",
    { timeout: 300_000 },
    () => {
      const run = runChain(migratedApp);

      expect(run.changedBy).toEqual([]);
      expect(run.source).toBe(migratedApp);
    },
  );
});
