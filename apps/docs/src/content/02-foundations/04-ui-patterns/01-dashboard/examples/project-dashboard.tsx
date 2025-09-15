import {
  AlertBadge,
  Avatar,
  Breadcrumb,
  Button,
  ColumnLayout,
  Content,
  DonutChart,
  Flex,
  Header,
  Heading,
  IconCheck,
  IconEmail,
  Image,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <ColumnLayout l={[1]} m={[1]}>
      <Flex direction="column" gap="xs">
        <Breadcrumb color="light">
          <Link href="#">Projekt</Link>
          <Link href="#">Dashboard</Link>
        </Breadcrumb>
        <Heading color="light" level={1}>
          Dashboard
        </Heading>
      </Flex>
      <LayoutCard>
        <Section>
          <Heading>Projektdetails</Heading>
          <ColumnLayout>
            <LabeledValue>
              <Label>Short-ID</Label>
              <Text>p12345</Text>
            </LabeledValue>
            <LabeledValue>
              <Label>Server</Label>
              <Link href="#">Mein Server</Link>
            </LabeledValue>
          </ColumnLayout>
        </Section>
      </LayoutCard>
      <ColumnLayout l={[1, 1]} m={[1]}>
        <LayoutCard>
          <Section>
            <Header>
              <Heading>vCPU Auslastung</Heading>
              <Link href="#">Details</Link>
            </Header>
            <Flex
              columnGap="l"
              grow
              justify="center"
              rowGap="m"
              wrap="wrap"
            >
              <DonutChart
                aria-label="vCPU Auslastung"
                status="success"
                value={43}
              >
                43 %
              </DonutChart>
              <Flex direction="column" grow rowGap="m">
                <LabeledValue>
                  <Label>Messzeitpunkt</Label>
                  <Text>05.09.2025, 07:30 Uhr</Text>
                </LabeledValue>
                <LabeledValue>
                  <Label>Maximum (Letzte 7 Tage)</Label>
                  <Text>67 %</Text>
                </LabeledValue>
              </Flex>
            </Flex>
          </Section>
        </LayoutCard>
        <LayoutCard></LayoutCard>
      </ColumnLayout>
      <LayoutCard></LayoutCard>
    </ColumnLayout>
  );
};
