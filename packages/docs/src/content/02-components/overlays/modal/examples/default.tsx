import Modal, {
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import { Action } from "@mittwald/flow-react-components/Action";

<ModalTrigger>
  <Button variant="accent">Create customer</Button>
  <Modal>
    <Heading>New Customer</Heading>
    <Content>
      <Text>
        Create a new customer to manage your projects,
        members and payments.
      </Text>
      <TextField>
        <Label>Customer name</Label>
      </TextField>
    </Content>
    <ButtonGroup>
      <Action closeModal>
        <Button variant="accent" onPress={close}>
          Create customer
        </Button>
        <Button
          style="soft"
          variant="secondary"
          onPress={close}
        >
          Abort
        </Button>
      </Action>
    </ButtonGroup>
  </Modal>
</ModalTrigger>;
