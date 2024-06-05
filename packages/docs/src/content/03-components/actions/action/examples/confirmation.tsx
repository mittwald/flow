import Button from "@mittwald/flow-react-components/Button";
import Action from "@mittwald/flow-react-components/Action";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import { Modal } from "@mittwald/flow-react-components/Modal";
import Heading from "@mittwald/flow-react-components/Heading";
import { Content } from "@mittwald/flow-react-components/Content";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";

<Action action={sleepLong}>
  <Modal slot="actionConfirm">
    <Heading>Projekt löschen</Heading>
    <Content>
      Das Löschen eines Projektes kann nicht rückgängig
      gemacht werden. Möchtest Du das Projekt
      &quot;Test&quot; dennoch löschen?
    </Content>
    <ActionGroup>
      <Button color="danger">
        Unwiederbringlich löschen
      </Button>
      <Button color="secondary" variant="soft">
        Abbrechen
      </Button>
    </ActionGroup>
  </Modal>
  <Button color="secondary" variant="soft">
    Projekt löschen
  </Button>
</Action>;
