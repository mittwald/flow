# @mittwald/flow-codemods

Codemods and an upgrade CLI for consumers of [Flow](https://flow.mittwald.de),
mittwald's design system. Run it one-off — there is no reason to install it as a
dependency.

```shell
npx @mittwald/flow-codemods@latest upgrade
```

Use whatever your project's package manager calls that: `npx …` (npm, and Yarn
Classic, which has no `dlx`), `pnpm dlx …`, `yarn dlx …`, `bun x …`. Every
command the CLI prints for you to copy uses the form it detected for your
project, so the examples below stay on `npx` only because a README cannot know.

## Commands

### `upgrade [revision]`

Bumps every Flow-line dependency in `package.json` to a resolved target,
installs, then runs the codemod of every migration up to that target.

"Flow line" is wider than `@mittwald/flow-*`: every package published from the
Flow monorepo shares one version, so `@mittwald/ext-bridge`,
`@mittwald/mstudio-ext-react-components` and `@mittwald/react-tunnel` move too.

`revision` is one of:

- `patch` — stays inside the current minor
- `minor` (default) — stays inside the current major
- `major` — no ceiling
- a dist-tag, e.g. `latest` or `next`
- an exact version, e.g. `1.4.0`

The target is resolved from the versions every declared Flow dependency has
actually published — not just one of them — so the command never writes a
version some dependency lacks.

`dependencies`, `devDependencies` and `optionalDependencies` are rewritten.
**`peerDependencies` are reported and left alone**: a peer range states which
versions your package supports, not one it installs, and narrowing `^1.0.0` to
`^1.0.14` would change what _your_ consumers are allowed to install. That is
your call, not the command's.

#### Which package manager installs

Detected by walking **up** from the directory you run in: lockfiles first, then
`packageManager`, then `devEngines.packageManager`, then the metadata a manager
leaves in `node_modules`. Walking up is what makes a workspace package work — it
has no lockfile of its own, and detecting in that directory alone used to fall
back to `npm install`, which on a `workspace:*` manifest fails outright. npm
stays the fallback when nothing says anything: it is always there next to Node.

A `packageManager` pin is honoured. If the binary on `PATH` already satisfies
it, that one runs; otherwise the install goes through corepack (with the
download prompt disabled, since this runs unattended). If neither works, the
command refuses **before** installing and names the pin, the version it found,
and where to get the right one — rather than installing with the wrong manager.

The log line names the agent, the pin and the command it actually ran, so a
wrong detection is visible instead of silent.

After installing, `upgrade` runs the codemod of every migration whose `since` is
at or below the target and prints the ones with no codemod, for you to apply by
hand.

**There is deliberately no lower bound.** Nothing records which migrations a
project already performed, so `upgrade` offers all of them rather than guessing
from the version you happen to be on — a project that never ran the command can
catch up. Re-running a codemod is safe: every transform is tested for it.

Options:

- `-y`, `--yes` — accept every default (which codemods to run). Implied when
  stdin is not a TTY, so CI and agent runs never block on a prompt.
- `--dry` — resolve the target and print what would change, but write nothing
  and skip the install. Codemods still run in this mode, against whatever is
  currently installed rather than the target — their output is indicative, not
  exact.
- `--allow-dirty` — run even though the working tree has uncommitted changes.
  Codemods rewrite files in place; without this flag, `upgrade` refuses on a
  dirty tree so a bad run is still `git checkout`-able.
- `--path <dir>` — sources to run the codemods against. Defaults to `./src` when
  that directory exists, otherwise the project root. Give it explicitly if your
  sources live somewhere else — an unrelated `src/` next to them would otherwise
  win.
- `--print` — print each codemod's transformed output.

### `list [revision]`

Shows migrations — codemod and by-hand alike — without touching the project. The
read-only planning entry point: run it before `upgrade` to see what a bump would
involve.

- `list` (no argument) — the whole catalogue. Hits no network. It does read
  lockfiles and `package.json` up the tree, but only to work out whether the
  commands it prints should say `npx`, `pnpm dlx`, `yarn dlx` or `bun x` — a
  command you can paste is worth more than never touching a manifest.
- `list [revision]` — the same manifest read, registry fetch, and revision
  resolution `upgrade [revision]` does, showing exactly the range it would act
  on, without writing anything. `revision` takes the same values as `upgrade`'s
  — `patch` | `minor` | `major` | a dist-tag | an exact version — and there is
  no default: only a given revision switches `list` into this form.

Options:

- `--json` — machine-readable output: an object with `range`
  (`current`/`target`, or `null` for the offline whole-catalogue form) and
  `migrations`, each entry carrying `catchUp`

### `<id> [path]`

Runs a single codemod by its catalogue id (see `list`) against `path` — which
defaults to `./src` when that directory exists, otherwise the project root.

Options: `--dry`, `--print` — same meaning as under `upgrade`.

### `to-remote-package`

A port, not a migration: it rewrites every `@mittwald/flow-react-components`
import to `@mittwald/flow-remote-react-components`. It has no catalogue entry —
no version range calls for it, and it never shows up in `list` or `upgrade`. Run
it deliberately when moving an app into an mStudio extension; on a normal app it
rewrites every Flow import.

```shell
npx @mittwald/flow-codemods@latest to-remote-package src
```

## Exit codes

`0` on success, `1` on a refusal — dirty tree, unresolvable revision, failed
install, an unknown id, or an id whose migration has no codemod — and `1` when a
codemod reports an error, is declined for every file it looked at, or found
nothing under `path` to process.
