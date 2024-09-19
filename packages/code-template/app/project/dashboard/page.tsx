import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import styles from "../../layout.module.scss";
import Header from "@mittwald/flow-react-components/Header";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import { IconContextMenu } from "@mittwald/flow-react-components/Icons";

export default function Page() {
  return (
    <>
      <Breadcrumb color="light">
        <Link href="/project">Projekt</Link>
        <Link>Dashboard</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Dashboard
      </Heading>
      <div className={styles.content}>
        <LayoutCard>
          <Section>
            <Header>
              <Heading>Projektübersicht</Heading>
              <ContextMenuTrigger>
                <Button color="secondary" variant="soft">
                  <IconContextMenu />
                </Button>
                <ContextMenu>
                  <MenuItem>Projektname ändern</MenuItem>
                  <MenuItem>Projekt kündigen</MenuItem>
                </ContextMenu>
              </ContextMenuTrigger>
              <Button>Tarif anpassen</Button>
            </Header>
            <ColumnLayout>
              <LabeledValue>
                <Label>Projektname</Label>
                <Text>Mein Projekt</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Server</Label>
                <Text>Mein Server</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Projektdomain</Label>
                <Link href="https://p-lis5uw.project.space">
                  p-lis5uw.project.space
                </Link>
                <CopyButton text="p-lis5uw.project.space" />
              </LabeledValue>
              <LabeledValue>
                <Label>Erstelldatum</Label>
                <Text>06.12.2023 um 11:40 Uhr</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>A-Record</Label>
                <Text>45.225.312.55</Text>
                <CopyButton text="45.225.312.55" />
              </LabeledValue>
              <LabeledValue>
                <Label>Short-ID</Label>
                <Text>p-lis5uw</Text>
                <CopyButton text="p-x2l7wi" />
              </LabeledValue>
            </ColumnLayout>
          </Section>
        </LayoutCard>
        <ColumnLayout l={[2, 1]}>
          <LayoutCard>
            <Section>
              <Heading>Lerne mehr über Flow</Heading>
              <Text>
                Nutze unseren Styleguide, um mehr über das Design System Flow zu
                erfahren und konsistente Benutzeroberflächen zu entwickeln.
              </Text>
              <Link href="https://mittwald.github.io/flow">Zum Styleguide</Link>
            </Section>
          </LayoutCard>
          <LayoutCard>
            <Section>
              <Heading>Gib uns Feedback</Heading>
              <Text>
                Wir freuen uns auf deine Anmerkungen und Wünsche zu Flow.
              </Text>
              <Link href="https://github.com/mittwald/flow/issues/new">
                Zum GitHub Repository
              </Link>
            </Section>
          </LayoutCard>
        </ColumnLayout>
      </div>
    </>
  );
}
