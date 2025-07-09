import { Section, SuspenseTrigger, Text } from "@/auto-generated";

export const standard = () => (
  <Section>
    <Text data-testid="content">Some content</Text>
    <SuspenseTrigger />
  </Section>
);
