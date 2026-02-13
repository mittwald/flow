import {
  ActionGroup,
  AlertBadge,
  Button,
  Flex,
  Heading,
  LayoutCard,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const TicketList = typedList<{
    id: string;
    description: string;
    createdBy: string;
    status: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Tickets
      </Heading>
      <LayoutCard>
        <TicketList.List
          aria-label="Tickets"
          loadingItemsCount={3}
          getItemId={(ticket) => ticket.id}
          defaultViewMode="table"
        >
          <TicketList.StaticData
            data={[
              {
                id: "1",
                description:
                  "Meine Website läuft nicht mehr",
                createdBy: "Karl Heinz, 12.11.2025, 22:45",
                status: "Offen",
              },
              {
                id: "2",
                description: "Hilfe beim Aufbauen",
                createdBy:
                  "Isabell Meyer, 11.11.2025, 01:57",
                status: "Offen",
              },
              {
                id: "3",
                description: "Irgendwas stimmt nicht",
                createdBy: "Gerd Simon, 10.11.2025, 15:12",
                status: "Offen",
              },
            ]}
          />
          <TicketList.Search />
          <TicketList.Sorting
            name="Erstelldatum"
            defaultEnabled
            direction="asc"
            property="createdBy"
            directionName="älteste zuerst"
          />
          <TicketList.Sorting
            name="Erstelldatum"
            direction="desc"
            property="createdBy"
            directionName="neueste zuerst"
          />
          <TicketList.Filter
            name="Status"
            property="status"
          />
          <TicketList.Table>
            <TicketList.TableHeader>
              <TicketList.TableColumn>
                Betreff
              </TicketList.TableColumn>
              <TicketList.TableColumn>
                Erstellt
              </TicketList.TableColumn>
              <TicketList.TableColumn>
                Status
              </TicketList.TableColumn>
            </TicketList.TableHeader>
            <TicketList.TableBody>
              <TicketList.TableRow>
                <TicketList.TableCell>
                  {(ticket) => ticket.description}
                </TicketList.TableCell>
                <TicketList.TableCell>
                  {(ticket) => ticket.createdBy}
                </TicketList.TableCell>
                <TicketList.TableCell>
                  {(ticket) => (
                    <AlertBadge>{ticket.status}</AlertBadge>
                  )}
                </TicketList.TableCell>
              </TicketList.TableRow>
            </TicketList.TableBody>
          </TicketList.Table>
          <ActionGroup>
            <Button color="accent">
              <Text>Anlegen</Text>
            </Button>
          </ActionGroup>
        </TicketList.List>
      </LayoutCard>
    </Flex>
  );
};
