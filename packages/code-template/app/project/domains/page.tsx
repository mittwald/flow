"use client";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import { ModalTrigger } from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import { AddDomainModal } from "@/app/project/domains/_components/AddDomainModal";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import styles from "../../layout.module.scss";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import { ListItemView, typedList } from "@mittwald/flow-react-components/List";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconDomain,
  IconHome,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import type { Domain } from "@/api/domainApi";
import { listDomains } from "@/api/domainApi";
import { AlertBadge } from "@mittwald/flow-react-components/AlertBadge";
import { ActionGroup } from "@mittwald/flow-react-components/ActionGroup";

export default function Page() {
  const DomainList = typedList<Domain>();

  const domains = listDomains();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/project">Projekt</Link>
        <Link>Domains</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Domains
      </Heading>
      <LayoutCard className={styles.content}>
        <Section>
          <DomainList.List batchSize={5}>
            <ActionGroup>
              <ModalTrigger>
                <Button color="accent">Domain anlegen</Button>
                <AddDomainModal />
              </ModalTrigger>
            </ActionGroup>
            <DomainList.StaticData data={domains} />
            <DomainList.Search />
            <DomainList.Sorting
              property="domain"
              name="A bis Z"
              defaultEnabled
            />
            <DomainList.Sorting
              property="domain"
              name="Z bis A"
              direction="desc"
            />
            <DomainList.Filter name="Filter" property="type" />

            <DomainList.Item href={(domain) => `/project/domains/${domain.id}`}>
              {(domain) => (
                <ListItemView>
                  <Avatar
                    color={
                      domain.type === "Domain"
                        ? "blue"
                        : domain.type === "Subdomain"
                          ? "teal"
                          : "lilac"
                    }
                  >
                    {domain.type === "Domain" ? (
                      <IconDomain />
                    ) : domain.type === "Subdomain" ? (
                      <IconSubdomain />
                    ) : (
                      <IconHome />
                    )}
                  </Avatar>
                  <Heading>
                    {domain.hostname}
                    {!domain.ssl && (
                      <AlertBadge status="danger">SSL-Zertifikat</AlertBadge>
                    )}
                  </Heading>
                  <Text>{domain.type}</Text>
                </ListItemView>
              )}
            </DomainList.Item>
          </DomainList.List>
        </Section>
      </LayoutCard>
    </>
  );
}
