"use client";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import { getDomain } from "@/api/domainApi";
import InlineAlert from "@mittwald/flow-react-components/InlineAlert";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import Content from "@mittwald/flow-react-components/Content";
import Header from "@mittwald/flow-react-components/Header";
import Button from "@mittwald/flow-react-components/Button";
import { IconContextMenu } from "@mittwald/flow-react-components/Icons";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import { ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { UpdateDomainOwnerModal } from "@/app/project/domains/_components/UpdateDomainOwnerModal";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const domain = getDomain(id);

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/project">Projekt</Link>
        <Link href="/project/domains">Domains</Link>
        <Link>{domain.hostname}</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        {domain.hostname}
      </Heading>
      <LayoutCard>
        <Section>
          {!domain.ssl && (
            <InlineAlert status="danger">
              <Heading>
                Es konnte kein SSL-Zertifikat ausgestellt werden
              </Heading>
              <Content>
                <Text>
                  Für diese Domain konnte kein SSL-Zertifikat ausgestellt
                  werden, da {domain.domain} nicht per DNS auf deine Server-IP
                  zeigt. Ändere den A-Record oder CNAME auf die Server-IP
                  zeigen. Es kann einige Minuten dauern, bis das Zertifikat bei
                  korrekten Einstellungen ausgestellt ist.
                </Text>
                <Link>SSL-Zertifikat ausstellen</Link>
              </Content>
            </InlineAlert>
          )}
        </Section>
        <Section>
          <Header>
            <Heading>Domain-Details</Heading>
            <ContextMenuTrigger>
              <Button color="secondary" variant="soft">
                <IconContextMenu />
              </Button>
              <ContextMenu>
                <MenuItem>Domain umziehen</MenuItem>
                <MenuItem>Domain entfernen</MenuItem>
              </ContextMenu>
            </ContextMenuTrigger>
            <Button>Domain-Ziel ändern</Button>
          </Header>
          <ColumnLayout>
            <LabeledValue>
              <Label>Domain-Ziel</Label>
              <Text>{domain.domain}</Text>
            </LabeledValue>
            <LabeledValue>
              <Label>Zertifikat</Label>
              <Text>{domain.ssl ?? "-"}</Text>
            </LabeledValue>
          </ColumnLayout>
        </Section>
        <Section>
          <Header>
            <Heading>Domain-Inhaber</Heading>
            <ModalTrigger>
              <Button color="secondary" variant="soft">
                Bearbeiten
              </Button>
              <UpdateDomainOwnerModal owner={domain.owner} />
            </ModalTrigger>
          </Header>
          <ColumnLayout>
            <LabeledValue>
              <Label>Inhaber</Label>
              <Text>
                {domain.owner.firstName} {domain.owner.lastName}
                <br />
                {domain.owner.street} {domain.owner.houseNumber}
                <br />
                {domain.owner.zip} {domain.owner.city}
                <br />
                {domain.owner.country}
              </Text>
            </LabeledValue>
            <LabeledValue>
              <Label>Kontaktdaten</Label>
              <Text>
                {domain.owner.email}
                <br />
                {domain.owner.phone}
              </Text>
            </LabeledValue>
          </ColumnLayout>
        </Section>
      </LayoutCard>
    </>
  );
}
