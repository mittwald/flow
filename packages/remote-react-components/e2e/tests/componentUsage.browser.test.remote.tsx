import {
  Button,
  Content,
  CountryOptions,
  Heading,
  Modal,
  ModalTrigger,
  Section,
  Select,
  Text,
} from "@mittwald/flow-remote-react-components";

export const modal = () => (
  <Section>
    <Heading>Death Star</Heading>
    <ModalTrigger>
      <Button>Battle station controls</Button>
      <Modal>
        <Content>
          <Text>Command the systems.</Text>
        </Content>
      </Modal>
    </ModalTrigger>
  </Section>
);

export const internalComposition = () => (
  <Select label="Country">
    <CountryOptions />
  </Select>
);
