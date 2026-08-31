/**
 * Content groups under `components` that document an integration rather than a
 * component. Navigation and the component overview both list them apart from
 * the components, so the set lives in one place.
 */
const integrationGroups = ["react-hook-form"];

export const isIntegrationGroup = (group: string): boolean =>
  integrationGroups.includes(group);
