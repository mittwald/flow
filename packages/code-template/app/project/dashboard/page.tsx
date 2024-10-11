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
import { getProject } from "@/api/projectApi";
import { FeedbackLayoutCard } from "@/app/_components/FeedbackLayoutCard";
import { StyleguideLayoutCard } from "@/app/_components/StyleguideLayoutCard";

export default function Page() {
  const project = getProject();

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
                <Text>{project.name}</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Server</Label>
                <Text>{project.server}</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Projektdomain</Label>
                <Link href={project.domain}>{project.domain}</Link>
                <CopyButton text={project.domain} />
              </LabeledValue>
              <LabeledValue>
                <Label>Erstelldatum</Label>
                <Text>{project.createdAt}</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>A-Record</Label>
                <Text>{project.aRecord}</Text>
                <CopyButton text={project.aRecord} />
              </LabeledValue>
              <LabeledValue>
                <Label>Short-ID</Label>
                <Text>{project.shortId}</Text>
                <CopyButton text={project.shortId} />
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
