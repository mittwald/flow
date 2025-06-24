import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";

<Action action={sleepLong}>
  <Modal slot="actionConfirm">
    <Heading>Projekt löschen</Heading>
    <Content>
      Wenn das Projekt &quot;Test&quot; einmal gelöscht ist, kann es nicht wiederhergestellt werden.
    </Content>
    <ActionGroup>
      <Button color="danger">
        Löschen
      </Button>
      <Button color="secondary" variant="soft">
        Abbrechen
      </Button>
    </ActionGroup>
  </Modal>
  <Button color="danger">
    Projekt löschen
  </Button>
</Action>;
