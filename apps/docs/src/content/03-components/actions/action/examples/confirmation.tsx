import { Button } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import { Heading } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Modal } from "@mittwald/flow-react-components";

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
