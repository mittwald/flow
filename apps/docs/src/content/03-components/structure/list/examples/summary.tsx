import {
  ListItemView,
  ListSummary,
  typedList,
} from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";

export default () => {
  const InvoiceList = typedList<{
    id: string;
    date: string;
    amount: string;
  }>();

  return (
    <InvoiceList.List batchSize={5} aria-label="Invoices">
      <ListSummary>
        <Text
          style={{ display: "block", textAlign: "right" }}
        >
          <b>Gesamt: 41,00 €</b>
        </Text>
      </ListSummary>
      <InvoiceList.StaticData
        data={[
          {
            id: "RG100000",
            date: "1.9.2024",
            amount: "25,00 €",
          },
          {
            id: "RG100001",
            date: "12.9.2024",
            amount: "12,00 €",
          },
          {
            id: "RG100002",
            date: "3.10.2024",
            amount: "4,00 €",
          },
        ]}
      />

      <InvoiceList.Item>
        {(invoice) => (
          <ListItemView>
            <Heading>{invoice.id}</Heading>
            <Text>
              {invoice.date} - {invoice.amount}
            </Text>
          </ListItemView>
        )}
      </InvoiceList.Item>
    </InvoiceList.List>
  );
};
