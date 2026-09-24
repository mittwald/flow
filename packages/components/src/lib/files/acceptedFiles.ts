import type { DropItem } from "@react-types/shared";

/**
 * Whether a file matches an `accept` attribute value — a comma separated list
 * of MIME types (`image/png`), MIME wildcards (`image/*`) and file extensions
 * (`.png`). A missing or empty list matches everything, the way the attribute
 * itself does.
 *
 * @internal
 */
export const matchesAccept = (
  file: Pick<File, "name" | "type">,
  accept?: string,
): boolean => {
  const tokens =
    accept
      ?.split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean) ?? [];

  if (tokens.length === 0) {
    return true;
  }

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }
    if (token.endsWith("/*")) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
};

/**
 * The files of a drop event that match `accept`. Non-file items (dragged text,
 * directories) are skipped, and the filter runs on the drop item — so a file
 * `accept` rejects is never read from disk.
 *
 * @internal
 */
export const getAcceptedFiles = async (
  items: readonly DropItem[],
  accept?: string,
): Promise<File[]> =>
  await Promise.all(
    items
      .filter((item) => item.kind === "file")
      .filter((item) => matchesAccept(item, accept))
      .map(async (item) => await item.getFile()),
  );
