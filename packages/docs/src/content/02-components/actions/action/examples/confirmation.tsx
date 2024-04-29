import Button from "@mittwald/flow-react-components/Button";
import Action from "@mittwald/flow-react-components/Action";
import { sleepLong } from "@/content/02-components/actions/action/examples/lib";
import { Modal } from "@mittwald/flow-react-components/Modal";
import Heading from "@mittwald/flow-react-components/Heading";
import { Content } from "@mittwald/flow-react-components/Content";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";

<Action action={sleepLong}>
  <Modal slot="actionConfirm">
    <Heading>Projekt löschen</Heading>
    <Content>
      Das Löschen eines Projektes kann nicht rückgängig
      gemacht werden. Möchtest Du das Projekt
      &quot;Test&quot; dennoch löschen?
    </Content>
    <ButtonGroup>
      <Button variant="danger">
        Unwiederbringlich löschen
      </Button>
      <Button variant="secondary" style="soft">
        Abbrechen
      </Button>
    </ButtonGroup>
  </Modal>
  <Button variant="secondary" style="soft">
    Projekt löschen
  </Button>
</Action>;
