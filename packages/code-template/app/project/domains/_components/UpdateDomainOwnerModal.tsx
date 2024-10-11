import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Modal from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import type { FC } from "react";
import type { DomainOwner } from "@/api/domainApi";
import { Form } from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import Action from "@mittwald/flow-react-components/Action";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import DomainOwnerFormFields from "@/app/project/domains/_components/DomainOwnerFormFields";

interface Props {
  owner: DomainOwner;
}

export const UpdateDomainOwnerModal: FC<Props> = (props) => {
  const { owner } = props;

  const controller = useOverlayController("Modal");

  const form = useForm<DomainOwner>({
    defaultValues: {
      firstName: owner.firstName,
      lastName: owner.lastName,
      street: owner.street,
      houseNumber: owner.houseNumber,
      zip: owner.zip,
      city: owner.city,
      country: owner.country,
      email: owner.email,
      phone: owner.phone,
    },
  });

  const handleOnSubmit = async (values: DomainOwner) => {
    console.log(values);
    controller.close();
    form.reset();
  };

  return (
    <Modal>
      <Form form={form} onSubmit={handleOnSubmit}>
        <Heading>Domain-Inhaber bearbeiten</Heading>
        <Content>
          <Section>
            <DomainOwnerFormFields form={form} />
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Action action={() => form.reset()}>
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </Action>
          <Button color="accent" type="submit">
            Speichern
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
