import type { FC } from "react";
import type { InvoiceSettings } from "@/api/customerApi";
import Text from "@mittwald/flow-react-components/Text";

interface Props {
  invoiceSettings: InvoiceSettings;
}

export const InvoiceSettingsText: FC<Props> = (props) => {
  const { invoiceSettings } = props;

  return (
    <Text>
      <b>{invoiceSettings.type}</b>
      <br />
      {invoiceSettings.firstName} {invoiceSettings.lastName}
      <br />
      {invoiceSettings.street} {invoiceSettings.houseNumber}
      <br />
      {invoiceSettings.zip} {invoiceSettings.city}
      <br />
      {invoiceSettings.email}
    </Text>
  );
};
