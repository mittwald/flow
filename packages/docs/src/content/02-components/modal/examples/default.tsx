import Modal from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";
import Button from "@mittwald/flow-react-components/Button";
import DialogTrigger from "@mittwald/flow-react-components/DialogTrigger";
import Title from "@mittwald/flow-react-components/Title";

<DialogTrigger>
  <Button variant="accent">Create customer</Button>
  <Modal>
    {({ close }) => (
      <>
        <Content>
          <Title>New Customer</Title>
          <Text>
            Create a new customer to manage your projects,
            members and payments.
          </Text>
          <TextField>
            <Label>Customer name</Label>
          </TextField>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={close}>
            Abort
          </Button>
          <Button variant="accent" onPress={close}>
            Create customer
          </Button>
        </ButtonGroup>
      </>
    )}
  </Modal>
</DialogTrigger>;
