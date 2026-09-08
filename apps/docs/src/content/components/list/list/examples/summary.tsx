import {
  Flex,
  Heading,
  ListItemView,
  ListSummary,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const InvoiceList = typedList<{
    id: string;
    amount: string;
  }>();

  return (
    <InvoiceList.List
      batchSize={2}
      hidePagination
      aria-label="Rechnungen"
      getItemId={(invoice) => invoice.id}
    >
      <ListSummary position="bottom">
        <Flex justify="end">
          <Text>
            <strong>Gesamt: 37,00 €</strong>
          </Text>
        </Flex>
      </ListSummary>
      <InvoiceList.StaticData
        data={[
          {
            id: "Rechnung 1",
            amount: "25,00 €",
          },
          {
            id: "Rechnung 2",
            amount: "12,00 €",
          },
        ]}
      />

      <InvoiceList.Item textValue={(invoice) => invoice.id}>
        {(invoice) => (
          <ListItemView>
            <Heading>{invoice.id}</Heading>
            <Text>{invoice.amount}</Text>
          </ListItemView>
        )}
      </InvoiceList.Item>
    </InvoiceList.List>
  );
};
