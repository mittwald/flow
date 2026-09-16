import {
  Button,
  CoachMark,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Section style={{ paddingBlockEnd: 200 }}>
    <Button id="backup-button">Backup erstellen</Button>

    <CoachMark
      shouldFlip={false}
      anchor="backup-button"
      defaultOpen
    >
      <Heading>Neu: Backups planen</Heading>
      <Text>
        Lege fest, wann ein Backup automatisch erstellt
        wird.
      </Text>
    </CoachMark>
  </Section>
);
