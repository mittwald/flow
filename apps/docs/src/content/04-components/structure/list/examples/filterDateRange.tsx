import { typedList } from "@mittwald/flow-react-components";
import {
  type CalendarDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

export default () => {
  const InvoiceList = typedList<{
    id: string;
    date: CalendarDate;
  }>();

  return (
    <InvoiceList.List
      aria-label="Rechnungen"
      defaultViewMode="table"
      getItemId={(domain) => domain.id}
    >
      <InvoiceList.StaticData
        data={[
          {
            id: "RG100000",
            date: today(getLocalTimeZone()),
          },
          {
            id: "RG100001",
            date: today(getLocalTimeZone()).subtract({
              days: 7,
            }),
          },
          {
            id: "RG100002",
            date: today(getLocalTimeZone()).subtract({
              days: 14,
            }),
          },
        ]}
      />
      <InvoiceList.Filter
        property="date"
        mode="dateRange"
        name="Datum"
        dateRangeOptions={{
          maxValue: today(getLocalTimeZone()),
        }}
      />
      <InvoiceList.Table>
        <InvoiceList.TableHeader>
          <InvoiceList.TableColumn>
            Rechnung
          </InvoiceList.TableColumn>
          <InvoiceList.TableColumn>
            Datum
          </InvoiceList.TableColumn>
        </InvoiceList.TableHeader>

        <InvoiceList.TableBody>
          <InvoiceList.TableRow>
            <InvoiceList.TableCell>
              {(invoice) => invoice.id}
            </InvoiceList.TableCell>
            <InvoiceList.TableCell>
              {(invoice) =>
                `${invoice.date.day}.${invoice.date.month}.${invoice.date.year}`
              }
            </InvoiceList.TableCell>
          </InvoiceList.TableRow>
        </InvoiceList.TableBody>
      </InvoiceList.Table>
    </InvoiceList.List>
  );
};
