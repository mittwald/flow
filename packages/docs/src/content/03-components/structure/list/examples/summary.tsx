import {
  ListItemView,
  typedList,
} from "@mittwald/flow-react-components/List";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";

export default () => {
  const InvoiceList = typedList<{
    id: string;
    amount: string;
  }>();

  return (
    <InvoiceList.List batchSize={5} aria-label="Invoices">
      <ListSummary>
        <Text
          style={{ display: "block", textAlign: "right" }}
        >
          <b>Gesamtpreis: 41,00 €</b>
        </Text>
      </ListSummary>
      <InvoiceList.StaticData
        data={[
          { id: "RG100000", amount: "25,00 €" },
          { id: "RG100001", amount: "12,00 €" },
          { id: "RG100002", amount: "4,00 €" },
        ]}
      />
      <InvoiceList.Search autoFocus />
      <InvoiceList.Sorting property="id" name="A-Z" />
      <InvoiceList.Sorting
        property="id"
        name="Z-A"
        direction="desc"
      />

      <InvoiceList.Table>
        <InvoiceList.TableHeader>
          <InvoiceList.TableColumn>
            ID
          </InvoiceList.TableColumn>
          <InvoiceList.TableColumn>
            Amount
          </InvoiceList.TableColumn>
        </InvoiceList.TableHeader>

        <InvoiceList.TableBody>
          <InvoiceList.TableRow>
            <InvoiceList.TableCell>
              {(invoice) => invoice.id}
            </InvoiceList.TableCell>
            <InvoiceList.TableCell>
              {(invoice) => invoice.amount}
            </InvoiceList.TableCell>
          </InvoiceList.TableRow>
        </InvoiceList.TableBody>
      </InvoiceList.Table>
      <InvoiceList.Item>
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
