import {
  Combine,
  Avatar,
  AvatarStack,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Content,
  Heading,
  Initials,
  Modal,
  Section,
  Text,
  useModalController,
} from "@mittwald/flow-react-components";

export default () => {
  const controller = useModalController();

  const users = [
    "Max Mustermann",
    "John Doe",
    "Gillian Gopher",
    "Erika Musterfrau",
    "Jane Doe",
  ];

  return (
    <>
      <AvatarStack
        totalCount={users.length}
        onCountPress={controller.open}
      >
        {users.slice(0, 3).map((name) => (
          <ContextualHelpTrigger key={name}>
            <Button>
              <Avatar>
                <Initials>{name}</Initials>
              </Avatar>
            </Button>
            <ContextualHelp>
              <Text>{name}</Text>
            </ContextualHelp>
          </ContextualHelpTrigger>
        ))}
      </AvatarStack>

      <Modal controller={controller}>
        <Heading>Beteiligte User</Heading>
        <Content>
          <Section>
            {users.map((name) => (
              <Combine key={name}>
                <Avatar>
                  <Initials>{name}</Initials>
                </Avatar>
                <Text>{name}</Text>
              </Combine>
            ))}
          </Section>
        </Content>
      </Modal>
    </>
  );
};
