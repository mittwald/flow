import {
  CodeBlock,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Heading>Abruf per Kommandozeile</Heading>
      <Text>
        Mehrzeiliges oder zusammengesetztes gehört in einen
        CodeBlock – er bringt das Kopieren mit und behält
        die Formatierung.
      </Text>
      <CodeBlock
        language="bash"
        code={`openssl s_client -connect mail.mittwald.de:993 -crlf \\
  -quiet <<< "a1 LOGIN max@mustermann.de <passwort>"`}
      />
    </Section>
  </LayoutCard>
);
