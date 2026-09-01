import {
  Badge,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<Badge>
  <Label>Priorität</Label>
  <Text>Hoch</Text>
  <ContextualHelpTrigger subject="Priorität">
    <Button />
    <ContextualHelp>
      <Text>
        Tickets mit hoher Priorität werden zuerst
        bearbeitet.
      </Text>
    </ContextualHelp>
  </ContextualHelpTrigger>
</Badge>;
