import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import { Avatar } from "@/components/Avatar";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
import AlertBadge from "@/components/AlertBadge";
import type { Domain } from "../testData/domainApi";
import { getDomains, getTypes } from "../testData/domainApi";
import { Section } from "@/components/Section";
import { ListItemView, ListSummary, typedList } from "@/components/List";
import { Button } from "@/components/Button";
import IconDownload from "@/components/Icon/components/icons/IconDownload";
import { ActionGroup } from "@/components/ActionGroup";
import { Content } from "@/components/Content";

const loadDomains: AsyncDataLoader<Domain> = async (opts) => {
  const response = await getDomains({
    pagination: opts?.pagination
      ? {
          limit: opts.pagination.limit,
          skip: opts.pagination.offset,
        }
      : undefined,
    filter: opts?.filtering?.type
      ? {
          types: opts.filtering.type.values as string[],
        }
      : undefined,
    search: opts?.searchString,
  });

  return {
    data: response.data,
    itemTotalCount: response.totalCount,
  };
};

const meta: Meta<typeof List> = {
  title: "Structure/List",
  component: List,
  render: () => {
    const DomainList = typedList<Domain>();
    const availableTypes = usePromise(getTypes, []);

    return (
      <Section>
        <Heading>Domains</Heading>
        <DomainList.List
          batchSize={5}
          aria-label="Domains"
          onAction={(domain) => console.log(domain.hostname)}
        >
          <ActionGroup>
            <Button color="secondary" variant="soft" slot="secondary">
              <IconDownload />
            </Button>
            <Button color="accent">Anlegen</Button>
          </ActionGroup>
          <DomainList.LoaderAsync manualPagination manualSorting={false}>
            {loadDomains}
          </DomainList.LoaderAsync>
          <DomainList.Filter
            values={availableTypes}
            property="type"
            mode="all"
            name="Typ"
            defaultSelected={["Domain"]}
          />
          <DomainList.Search autoFocus autoSubmit />
          <DomainList.Sorting property="domain" name="A-Z" />
          <DomainList.Sorting property="domain" name="Z-A" direction="desc" />
          <DomainList.Sorting property="type" name="Typ" defaultEnabled />
          <DomainList.Sorting property="tld" name="TLD" />

          <DomainList.Table>
            <DomainList.TableHeader>
              <DomainList.TableColumn>Name</DomainList.TableColumn>
              <DomainList.TableColumn>Type</DomainList.TableColumn>
              <DomainList.TableColumn>TLD</DomainList.TableColumn>
              <DomainList.TableColumn>Hostname</DomainList.TableColumn>
            </DomainList.TableHeader>

            <DomainList.TableBody>
              <DomainList.TableRow>
                <DomainList.TableCell>
                  {(domain) => domain.domain}
                </DomainList.TableCell>
                <DomainList.TableCell>
                  {(domain) => domain.type}
                </DomainList.TableCell>
                <DomainList.TableCell>
                  {(domain) => domain.tld}
                </DomainList.TableCell>
                <DomainList.TableCell>
                  {(domain) => domain.hostname}
                </DomainList.TableCell>
              </DomainList.TableRow>
            </DomainList.TableBody>
          </DomainList.Table>

          <DomainList.Item textValue={(domain) => domain.hostname}>
            {(domain) => (
              <DomainList.ItemView>
                <Avatar color={domain.type === "Domain" ? "blue" : "teal"}>
                  {domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconSubdomain />
                  )}
                </Avatar>
                <Heading>
                  {domain.hostname}
                  {!domain.verified && (
                    <AlertBadge status="warning">Not verified</AlertBadge>
                  )}
                </Heading>
                <Text>{domain.type}</Text>

                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </DomainList.ItemView>
            )}
          </DomainList.Item>
        </DomainList.List>
      </Section>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithSummary: Story = {
  render: () => {
    const InvoiceList = typedList<{
      id: string;
      date: string;
      amount: string;
    }>();

    return (
      <Section>
        <Heading>Invoices</Heading>
        <InvoiceList.List batchSize={5} aria-label="Invoices">
          <ListSummary>
            <Text style={{ display: "block", textAlign: "right" }}>
              <b>total: 42,00 €</b>
            </Text>
          </ListSummary>
          <InvoiceList.StaticData
            data={[
              { id: "RG100000", date: "1.9.2024", amount: "25,00 €" },
              { id: "RG100001", date: "12.9.2024", amount: "12,00 €" },
              { id: "RG100002", date: "3.10.2024", amount: "4,00 €" },
            ]}
          />
          <InvoiceList.Item>
            {(invoice) => (
              <ListItemView>
                <Heading>{invoice.id}</Heading>
                <Text>
                  {invoice.date} - {invoice.amount}
                </Text>
              </ListItemView>
            )}
          </InvoiceList.Item>
        </InvoiceList.List>
      </Section>
    );
  },
};

export const WithAccordion: Story = {
  render: () => {
    const InvoiceList = typedList<{
      id: string;
      date: string;
      amount: string;
    }>();

    return (
      <Section>
        <Heading>Invoices</Heading>
        <InvoiceList.List batchSize={5} aria-label="Invoices" accordion>
          <InvoiceList.StaticData
            data={[
              { id: "RG100000", date: "1.9.2024", amount: "25,00 €" },
              { id: "RG100001", date: "12.9.2024", amount: "12,00 €" },
              { id: "RG100002", date: "3.10.2024", amount: "4,00 €" },
            ]}
          />
          <InvoiceList.Item
            defaultExpanded={(invoice) => invoice.id === "RG100001"}
          >
            {(invoice) => (
              <ListItemView>
                <Heading>{invoice.id}</Heading>
                <Content slot="bottom">
                  <Text>
                    {invoice.date} - {invoice.amount}
                  </Text>
                </Content>
              </ListItemView>
            )}
          </InvoiceList.Item>
        </InvoiceList.List>
      </Section>
    );
  },
};

export const WithTile: Story = {
  render: () => {
    const DomainList = typedList<Domain>();
    const availableTypes = usePromise(getTypes, []);

    return (
      <Section>
        <Heading>Domains</Heading>
        <DomainList.List
          batchSize={5}
          aria-label="Domains"
          onAction={(domain) => console.log(domain.hostname)}
          tile
        >
          <DomainList.LoaderAsync manualPagination manualSorting={false}>
            {loadDomains}
          </DomainList.LoaderAsync>
          <DomainList.Filter
            values={availableTypes}
            property="type"
            mode="all"
            name="Typ"
            defaultSelected={["Domain"]}
          />
          <DomainList.Search autoFocus autoSubmit />
          <DomainList.Sorting property="domain" name="A-Z" />
          <DomainList.Sorting property="domain" name="Z-A" direction="desc" />

          <DomainList.Item textValue={(domain) => domain.hostname}>
            {(domain) => (
              <DomainList.ItemView>
                <Avatar color={domain.type === "Domain" ? "blue" : "teal"}>
                  {domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconSubdomain />
                  )}
                </Avatar>
                <Heading>
                  {domain.hostname}
                  {!domain.verified && (
                    <AlertBadge status="warning">Not verified</AlertBadge>
                  )}
                </Heading>
                <Text>{domain.type}</Text>

                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </DomainList.ItemView>
            )}
          </DomainList.Item>
        </DomainList.List>
      </Section>
    );
  },
};
