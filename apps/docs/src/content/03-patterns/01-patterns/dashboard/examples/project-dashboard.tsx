import {
  Breadcrumb,
  ColumnLayout,
  DonutChart,
  Flex,
  Header,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  ProgressBar,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <ColumnLayout l={[1]} m={[1]}>
      <Flex direction="column" gap="xs">
        <Breadcrumb color="dark">
          <Link href="#">Projekt</Link>
          <Link href="#">Dashboard</Link>
        </Breadcrumb>
        <Heading color="dark" level={1}>
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
                <strong>43 %</strong>
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
        <LayoutCard>
          <Section>
            <Header>
              <Heading>RAM Auslastung</Heading>
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
                aria-label="RAM Auslastung"
                status="success"
                value={12}
              >
                <strong>12 %</strong>
              </DonutChart>
              <Flex direction="column" grow rowGap="m">
                <LabeledValue>
                  <Label>Messzeitpunkt</Label>
                  <Text>05.09.2025, 07:30 Uhr</Text>
                </LabeledValue>
                <LabeledValue>
                  <Label>Maximum (Letzte 7 Tage)</Label>
                  <Text>24 %</Text>
                </LabeledValue>
              </Flex>
            </Flex>
          </Section>
        </LayoutCard>
      </ColumnLayout>
      <LayoutCard>
        <Section>
          <Header>
            <Heading>Speicherplatz</Heading>
            <Link href="#">Details</Link>
          </Header>
          <ProgressBar
            value={2.3}
            maxValue={5}
            formatOptions={{
              style: "unit",
              unit: "gigabyte",
            }}
            showMaxValue
            size="l"
            status="success"
          >
            <Label>Speicherplatz</Label>
          </ProgressBar>
        </Section>
      </LayoutCard>
    </ColumnLayout>
  );
};
