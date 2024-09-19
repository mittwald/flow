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
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import { Domain, loadDomains } from "@/api/domainApi";

export default function Page() {
  const DomainList = typedList<Domain>();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/project">Projekt</Link>
        <Link>Domains</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Domains
      </Heading>
      <ModalTrigger>
        <Button color="accent">Domain anlegen</Button>
        <AddDomainModal />
      </ModalTrigger>
      <LayoutCard className={styles.content}>
        <Section>
          <DomainList.List batchSize={5}>
            <DomainList.LoaderAsync>{loadDomains}</DomainList.LoaderAsync>
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
                    variant={
                      domain.type === "Domain"
                        ? 2
                        : domain.type === "Subdomain"
                        ? 5
                        : 4
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
                      <StatusBadge status="danger">SSL-Zertifikat</StatusBadge>
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
