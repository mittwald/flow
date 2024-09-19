import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import styles from "@/app/layout.module.scss";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";

export default function Page() {
  return (
    <>
      <Breadcrumb color="light">
        <Link href="/customer">Organisation</Link>
        <Link>Dashboard</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Dashboard
      </Heading>
      <LayoutCard className={styles.content}>
        <Section>
          <Heading>Dashboard</Heading>
          <ColumnLayout>
            <LabeledValue>
              <Label>Vertragspartner</Label>
              <Text>
                John Doe
                <br />
                Beispielstraße 1
                <br />
                12345 Musterstadt
              </Text>
            </LabeledValue>
          </ColumnLayout>
        </Section>
      </LayoutCard>
    </>
  );
}
