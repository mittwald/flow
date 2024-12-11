import possibleStandardNames from "@/lib/possibleStandardNames";

export type SupportedProperties = Partial<
  Record<
    keyof typeof possibleStandardNames extends Record<string, unknown>
      ? keyof typeof possibleStandardNames
      : never,
    unknown
  >
>;
export type MappedReactNames<P extends SupportedProperties> = {
  [K in keyof P as K extends keyof typeof possibleStandardNames
    ? (typeof possibleStandardNames)[K]
    : K]: P[K];
};

export const mapReactElementAttributes = <PN extends SupportedProperties>(
  properties: PN,
): MappedReactNames<PN> => {
  const result: Record<string, unknown> = {};

  for (const propertyKey in properties) {
    const reactKey =
      possibleStandardNames[propertyKey as keyof typeof possibleStandardNames];
    if (reactKey && reactKey != propertyKey) {
      result[reactKey] = properties[propertyKey];
    } else {
      result[propertyKey] = properties[propertyKey];
    }
  }

  return result as MappedReactNames<PN>;
};
