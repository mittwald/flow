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

    {/* Pinned downwards so the hint stays inside this example's frame. */}
    <CoachMark
      shouldFlip={false}
      anchor="backup-button"
      isDefaultOpen
    >
      <Heading>Neu: Backups planen</Heading>
      <Text>
        Lege fest, wann ein Backup automatisch erstellt
        wird.
      </Text>
    </CoachMark>
  </Section>
);
