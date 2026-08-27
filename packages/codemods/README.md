# @mittwald/flow-codemods

Codemods and an upgrade CLI for consumers of [Flow](https://flow.mittwald.de),
mittwald's design system. Run it with `npx` — there is no reason to install it
as a dependency.

```shell
npx @mittwald/flow-codemods@latest upgrade
```

## Commands

### `upgrade [revision]`

Bumps every `@mittwald/flow-*` dependency in `package.json` to a resolved
target, installs, then runs the codemods the crossed version range calls for.

`revision` is one of:

- `patch` — stays inside the current minor
- `minor` (default) — stays inside the current major
- `major` — no ceiling
- a dist-tag, e.g. `latest` or `next`
- an exact version, e.g. `1.4.0`

The target is resolved from the versions every declared Flow dependency has
actually published — not just one of them — so the command never writes a
version some dependency lacks.

After installing, `upgrade` runs every codemod the crossed range calls for and
prints the migrations that have no codemod, for you to apply by hand.

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
- `--path <dir>` — sources to run the codemods against. Defaults to the project
  root.
- `--print` — print each codemod's transformed output.

### `list`

Shows the migrations in a version range — codemod and by-hand alike — without
touching the project. The read-only planning entry point: run it before
`upgrade` to see what a bump would involve.

Options:

- `--from`, `--to` — bound the range (each an exact published version)
- `--json` — machine-readable output

### `<id> [path]`

Runs a single codemod by its catalogue id (see `list`) against `path` (default:
the project root).

Options: `--dry`, `--print` — same meaning as under `upgrade`.

## Exit codes

`0` on success, `1` on a refusal (dirty tree, unresolvable revision, a failed
install) or when a codemod reports an error, is declined for every file it
looked at, or found nothing under `path` to process.
