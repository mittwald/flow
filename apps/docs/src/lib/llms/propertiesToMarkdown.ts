import type { Properties, Property } from "@/lib/PropertiesTables/types";

const escapeCell = (value: string | null | undefined): string =>
  (value ?? "")
    .replaceAll(/\r?\n/g, " ")
    .replaceAll("|", "\\|")
    .replace(/\s+/g, " ")
    .trim();

const formatDescription = (description: string | null | undefined): string =>
  escapeCell(
    (description ?? "")
      .replaceAll(/{@link (\S+) (.+?)}/g, "[$2]($1)")
      .replaceAll(/{@link (\S+)}/g, "[$1]($1)"),
  );

const renderRow = (property: Property): string => {
  const flags = [
    property.required ? " _(required)_" : "",
    property.deprecated ? " _(deprecated)_" : "",
  ].join("");
  const name = `\`${property.name}\`${flags}`;
  const type = property.type ? `\`${escapeCell(property.type)}\`` : "-";
  const defaultValue = property.default
    ? `\`${escapeCell(property.default)}\``
    : "-";
  const description = formatDescription(property.description) || "-";

  return `| ${name} | ${type} | ${defaultValue} | ${description} |`;
};

const renderTable = (heading: string | null, properties: Property[]): string =>
  [
    ...(heading ? [`### ${heading}`, ""] : []),
    "| Property | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...properties.map(renderRow),
  ].join("\n");

export const propertiesToMarkdown = (properties: Properties): string => {
  const sections: string[] = [];

  if (properties.other.length > 0) {
    sections.push(renderTable(null, properties.other));
  }
  if (properties.events.length > 0) {
    sections.push(renderTable("Events", properties.events));
  }
  if (properties.accessibility.length > 0) {
    sections.push(renderTable("Accessibility", properties.accessibility));
  }

  return sections.join("\n\n");
};
