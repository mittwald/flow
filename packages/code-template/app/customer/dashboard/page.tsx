import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import styles from "@/app/layout.module.scss";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import { getCustomer } from "@/api/customerApi";
import { FeedbackLayoutCard } from "@/app/_components/FeedbackLayoutCard";
import { StyleguideLayoutCard } from "@/app/_components/StyleguideLayoutCard";
import { ContractPartnerText } from "@/app/customer/_components/ContractPartnerText";
import { InvoiceSettingsText } from "@/app/customer/_components/InvoiceSettingsText";

export default function Page() {
  const customer = getCustomer();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/customer">Organisation</Link>
        <Link>Dashboard</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Dashboard
      </Heading>
      <div className={styles.content}>
        <LayoutCard>
          <Section>
            <Heading>Organisationsübersicht</Heading>
            <ColumnLayout>
              <LabeledValue>
                <Label>Vertragspartner</Label>
                <ContractPartnerText
                  contractPartner={customer.contractPartner}
                />
              </LabeledValue>
              <LabeledValue>
                <Label>Zahlungsmethode</Label>
                <InvoiceSettingsText
                  invoiceSettings={customer.invoiceSettings}
                />
              </LabeledValue>
            </ColumnLayout>
          </Section>
        </LayoutCard>
        <ColumnLayout l={[2, 1]}>
          <StyleguideLayoutCard />
          <FeedbackLayoutCard />
        </ColumnLayout>
      </div>
    </>
  );
}
