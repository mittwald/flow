import {
  CodeBlock,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
  ThemeScope,
} from "@mittwald/flow-react-components";

<ThemeScope theme="dark">
  <LayoutCard>
    <Section>
      <Heading>Fokus auf Developer Experience</Heading>
      <Text>
        Verschachtelte Components erleichtern das Einfügen.
        Automatisierungen ordnen Components mit passenden
        Abständen an und verhindern Abweichungen vom Design
        System.
      </Text>
      <CodeBlock
        copyable
        language="tsx"
        code={`<Section>
  <Heading>Speicherplatz erweitern</Heading>
  <Text>Dein Space Server nutzt 92 % seines Speicherplatzes.</Text>
  <Button>Speicher hinzubuchen</Button>
</Section>`}
      />
      <Link href="/components/actions/action-group">
        Zu den Components
      </Link>
    </Section>
  </LayoutCard>
</ThemeScope>;
