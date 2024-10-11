import type { FC } from "react";
import type { ContractPartner } from "@/api/customerApi";
import Text from "@mittwald/flow-react-components/Text";

interface Props {
  contractPartner: ContractPartner;
}

export const ContractPartnerText: FC<Props> = (props) => {
  const { contractPartner } = props;

  return (
    <Text>
      {contractPartner.firstName} {contractPartner.lastName}
      <br />
      {contractPartner.street} {contractPartner.houseNumber}
      <br />
      {contractPartner.zip} {contractPartner.city}
      <br />
      {contractPartner.email}
    </Text>
  );
};
