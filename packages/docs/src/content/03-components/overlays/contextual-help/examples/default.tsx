import {
  ContextualHelp,
  ContextualHelpButton,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components/ContextualHelp";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { Link } from "@mittwald/flow-react-components/Link";

<ContextualHelpTrigger>
  <ContextualHelpButton />
  <ContextualHelp>
    <Heading>Rechte & Rollen</Heading>
    <Text>
      Jedem Benutzer-Profil wird im mStudio je Projekt
      und/oder Organisation eine Rolle zugewiesen. Das
      ermöglicht dir ein ganz neues und modernes Arbeiten.
    </Text>
    <Link>Mehr erfahren</Link>
  </ContextualHelp>
</ContextualHelpTrigger>;
