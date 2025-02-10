import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";

<ContextualHelpTrigger>
  <Button />

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
