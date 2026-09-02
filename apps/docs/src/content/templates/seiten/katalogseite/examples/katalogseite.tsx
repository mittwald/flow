import {
  Avatar,
  Badge,
  Content,
  Flex,
  Header,
  Heading,
  IconApp,
  Label,
  LayoutCard,
  Link,
  Section,
  Segment,
  SegmentedControl,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const TemplateList = typedList<{
    id: string;
    name: string;
    pitch: string;
    scope: string;
    price: string;
    popular: boolean;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Vorlagen
      </Heading>

      <LayoutCard>
        <Section>
          <SegmentedControl defaultValue="entdecken">
            <Label optional={false}>Ansicht</Label>
            <Segment value="entdecken">Entdecken</Segment>
            <Segment value="alle">Alle Vorlagen</Segment>
          </SegmentedControl>

          <Header>
            <Heading>Meiste Installationen</Heading>
            <Link href="#">Alle anzeigen</Link>
          </Header>

          <TemplateList.List
            aria-label="Vorlagen"
            getItemId={(template) => template.id}
            defaultViewMode="tiles"
            hidePagination
          >
            <TemplateList.Search />
            <TemplateList.StaticData
              data={[
                {
                  id: "1",
                  name: "n8n",
                  pitch:
                    "Automatisierung für deine Geschäftsprozesse",
                  scope: "Projekt",
                  price: "Ab 0,00 €",
                  popular: true,
                },
                {
                  id: "2",
                  name: "LibreChat",
                  pitch:
                    "Selbstgehostete Chat-Oberfläche für KI-Modelle",
                  scope: "Projekt",
                  price: "Ab 0,00 €",
                  popular: true,
                },
                {
                  id: "3",
                  name: "Uptime Kuma",
                  pitch: "Monitoring und Statusseiten",
                  scope: "Projekt",
                  price: "Ab 0,00 €",
                  popular: false,
                },
              ]}
            />
            <TemplateList.Item
              showTiles
              showList={false}
              href={() => "#"}
              textValue={(template) => template.name}
            >
              {(template) => (
                <TemplateList.ItemView>
                  <Avatar color="violet">
                    <IconApp />
                  </Avatar>
                  <Heading>
                    {template.name}
                    {template.popular && (
                      <Badge>Beliebt</Badge>
                    )}
                  </Heading>
                  <Text>{template.pitch}</Text>
                  <Content>
                    <Text>
                      {template.scope} · {template.price}
                    </Text>
                  </Content>
                </TemplateList.ItemView>
              )}
            </TemplateList.Item>
          </TemplateList.List>
        </Section>
      </LayoutCard>
    </Flex>
  );
};
