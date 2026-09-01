import {
  Action,
  ActionGroup,
  Avatar,
  Button,
  Content,
  FieldDescription,
  Heading,
  IconEmail,
  IconForwardAddress,
  Label,
  Modal,
  Option,
  Section,
  Select,
  Text,
  TextField,
  typedList,
  useModalController,
} from "@mittwald/flow-react-components";
import { useState } from "react";

type Step = "selectType" | "configure";

export default () => {
  const controller = useModalController();
  const [step, setStep] = useState<Step>("selectType");
  const [type, setType] = useState<string>();

  const TypeList = typedList<{
    id: string;
    name: string;
    description: string;
  }>();

  return (
    <>
      <Button
        onPress={() => {
          setStep("selectType");
          controller.open();
        }}
      >
        E-Mail-Adresse anlegen
      </Button>

      <Modal controller={controller} offCanvas>
        <Heading>E-Mail-Adresse anlegen</Heading>

        <Content>
          {step === "selectType" && (
            <Section>
              <Text>
                Wähle aus, welche Art von Adresse du anlegen
                möchtest.
              </Text>
              <TypeList.List
                aria-label="Art der Adresse"
                getItemId={(item) => item.id}
                hidePagination
                onAction={(item) => {
                  setType(item.name);
                  setStep("configure");
                }}
              >
                <TypeList.StaticData
                  data={[
                    {
                      id: "mailbox",
                      name: "Postfach",
                      description:
                        "Eine Adresse mit eigenem Speicherplatz zum Empfangen von E-Mails.",
                    },
                    {
                      id: "forward",
                      name: "Weiterleitung",
                      description:
                        "Eine Adresse, die eingehende E-Mails an eine andere Adresse weitergibt.",
                    },
                  ]}
                />
                <TypeList.Item
                  textValue={(item) => item.name}
                >
                  {(item) => (
                    <TypeList.ItemView>
                      <Avatar
                        color={
                          item.id === "forward"
                            ? "teal"
                            : "blue"
                        }
                      >
                        {item.id === "forward" ? (
                          <IconForwardAddress />
                        ) : (
                          <IconEmail />
                        )}
                      </Avatar>
                      <Heading>{item.name}</Heading>
                      <Text>{item.description}</Text>
                    </TypeList.ItemView>
                  )}
                </TypeList.Item>
              </TypeList.List>
            </Section>
          )}

          {step === "configure" && (
            <Section>
              <Text>Gewählt: {type}</Text>
              <TextField isRequired>
                <Label>Lokaler Teil</Label>
                <FieldDescription>
                  Der Teil vor dem @
                </FieldDescription>
              </TextField>
              <Select
                isRequired
                defaultSelectedKey="mustermann.de"
              >
                <Label>Domain</Label>
                <Option value="mustermann.de">
                  mustermann.de
                </Option>
                <Option value="muster-shop.de">
                  muster-shop.de
                </Option>
              </Select>
            </Section>
          )}
        </Content>

        <ActionGroup>
          {step === "configure" && (
            <>
              <Action closeModal>
                <Button>Anlegen</Button>
              </Action>
              <Button
                variant="soft"
                color="secondary"
                onPress={() => setStep("selectType")}
              >
                Zurück
              </Button>
            </>
          )}
          <Action closeModal>
            <Button variant="plain" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
