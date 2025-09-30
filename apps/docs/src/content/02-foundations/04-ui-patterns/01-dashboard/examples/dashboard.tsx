import {
  AlertBadge,
  Avatar,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Header,
  Heading,
  IconCheck,
  IconEmail,
  Image,
  LayoutCard,
  Link,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const List = typedList<{
    title: string;
    date: string;
    status?: "info" | "warning" | "danger";
    isInvite?: boolean;
  }>();

  return (
    <ColumnLayout l={[1]} m={[1]}>
      <Heading color="light" level={1}>
        Hey Max!
      </Heading>
      <ColumnLayout m={[1]} l={[3, 2]}>
        <ColumnLayout l={[1]} m={[1]}>
          <LayoutCard>
            <Section>
              <Header>
                <Heading>Benachrichtigungen</Heading>
                <Button
                  onPress={() => alert("not implemented")}
                  variant="soft"
                  color="secondary"
                >
                  Alle anzeigen
                </Button>
              </Header>
              <List.List
                hidePagination
                onAction={() => alert("not implemented")}
              >
                <List.StaticData
                  data={[
                    {
                      title:
                        "Projekteinladung: “Mein Projekt”",
                      date: "10.03.2025, 09:42 Uhr",
                      isInvite: true,
                    },
                    {
                      title:
                        "E-Mail-Empfang wurde deaktiviert",
                      date: "15.05.2025, 10:33 Uhr",
                      status: "danger",
                    },
                    {
                      title:
                        "E-Mail-Versand wurde gesperrt",
                      date: "15.05.2025, 10:33 Uhr",
                      status: "warning",
                    },
                    {
                      title: "Ticket wurde beantwortet",
                      date: "16.05.2025, 16:33 Uhr",
                      status: "info",
                    },
                  ]}
                />
                <List.Item textValue={(i) => i.title}>
                  {(i) => (
                    <List.ItemView>
                      {i.isInvite ? (
                        <Avatar>
                          <IconEmail />
                        </Avatar>
                      ) : (
                        <Avatar status={i.status} />
                      )}
                      <Heading>{i.title}</Heading>
                      <Text>{i.date}</Text>
                      <Content>
                        {i.isInvite ? (
                          <Button
                            onPress={() =>
                              alert("not implemented")
                            }
                            variant="soft"
                            color="secondary"
                          >
                            Öffnen
                          </Button>
                        ) : (
                          <Button
                            onPress={() =>
                              alert("not implemented")
                            }
                            aria-label="Erledigt"
                            variant="plain"
                            color="secondary"
                          >
                            <IconCheck />
                          </Button>
                        )}
                      </Content>
                    </List.ItemView>
                  )}
                </List.Item>
              </List.List>
            </Section>
          </LayoutCard>

          <LayoutCard>
            <ColumnLayout m={[1, 3]} s={[null, 1]}>
              <Flex align="center" grow>
                <Image
                  src="https://mittwald.github.io/flow/assets/onboarding.png"
                  alt=""
                  aria-hidden
                />
              </Flex>
              <Section>
                <Heading>mStudio entdecken</Heading>
                <Text>
                  Du willst das Beste aus deinen Projekten
                  herausholen? Unsere{" "}
                  <Link href="#">Wissensdatenbank</Link>{" "}
                  hilft dir dabei, das mStudio und seine
                  Möglichkeiten besser kennenzulernen.
                </Text>
              </Section>
            </ColumnLayout>
          </LayoutCard>
        </ColumnLayout>

        <ColumnLayout l={[1]} m={[1]}>
          <LayoutCard>
            <Section>
              <Heading>
                Status
                <AlertBadge status="success">
                  Alle Systeme funktionieren
                </AlertBadge>
              </Heading>
              <Text>
                Das mStudio und alle dazugehörenden Systeme
                laufen einwandfrei.
              </Text>
              <Link target="_blank" href="#">
                Zur Statusseite
              </Link>
            </Section>
          </LayoutCard>

          <LayoutCard>
            <Section>
              <Heading>Neues aus dem Blog</Heading>
              <Image
                src="https://mittwald.github.io/flow/assets/blog.png"
                alt=""
                aria-hidden
              />

              <Heading level={3}>
                Zukunft pflanzen – mittwald unterstützt 8000
                m² Aufforstung für den Klimaschutz
              </Heading>
              <Text>
                Nachhaltigkeitsmanager Marvin von mittwald
                berichtet über ein regionales
                Aufforstungsprojekt mit 8.000 m² neuem Wald.
              </Text>
              <Link href="#" target="_blank">
                Zum Blogartikel
              </Link>
            </Section>
          </LayoutCard>
        </ColumnLayout>
      </ColumnLayout>
    </ColumnLayout>
  );
};
