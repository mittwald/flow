import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const brandTokenFile = path.resolve(
  import.meta.dirname,
  "../../../design-tokens/src/color-brand.yml",
);

/**
 * The Brand groups (`mittwald-blue`, `black-alpha`, …): the keys under `color`
 * in the Brand token file. Read from the file, so a new group is covered
 * without touching the lint rules.
 */
export const collectBrandColorGroups = (file = brandTokenFile) =>
  new Set(Object.keys(parse(fs.readFileSync(file, "utf8")).color ?? {}));

let cachedGroups;

export const brandColorGroups = () =>
  (cachedGroups ??= collectBrandColorGroups());

const colorVariablePattern = /(?<![\w-])--color--([\w-]*)/g;

/**
 * Every Brand CSS variable named in `text`. A Brand token
 * `color.<group>.<step>` becomes `--color--<group>--<step>`, so the group is
 * the first segment after `--color--`.
 *
 * A name completed at runtime cannot be checked by its group, only by the part
 * that is literal: `--color--#{$hue}--100` and `--color--${hue}` name a Brand
 * variable whatever the interpolation holds, because only the Brand tier
 * defines tokens under `color`. A name is completed at runtime when an SCSS
 * interpolation (`#{`) follows it, or when it ends the text and `openEnd` says
 * the text may continue at runtime (a JS string concatenated with `+`, a
 * template literal's quasi before a `${}`).
 */
export const findBrandColorVariables = (
  text,
  { groups = brandColorGroups(), openEnd = false } = {},
) => {
  const found = [];

  for (const match of text.matchAll(colorVariablePattern)) {
    const [name, rest] = match;
    const end = match.index + name.length;
    const group = rest.split("--")[0];
    const continuedAtRuntime =
      !rest.includes("--") &&
      (text.startsWith("#{", end) || (openEnd && end === text.length));

    if (groups.has(group)) {
      found.push({ name, index: match.index, completedAtRuntime: false });
    } else if (
      continuedAtRuntime &&
      groups.values().some((known) => known.startsWith(group))
    ) {
      found.push({ name, index: match.index, completedAtRuntime: true });
    }
  }

  return found;
};

export const hint =
  "Brand is the palette from the brand handover: theme-neutral, so it never switches to dark (ADR 0007, docs/adr/0007-color-token-tiers.md). Use a Semantic (`--primary--color--…`, `--neutral--color--…`) or Variant (`--primary-solid-background-color`) variable instead, preferably through a component token. Only docs pages that display the palette itself may name Brand variables.";
