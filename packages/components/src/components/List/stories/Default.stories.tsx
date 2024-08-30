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
import StatusBadge from "@/components/StatusBadge";
import type { Domain } from "../testData/domainApi";
import { getDomains, getTypes } from "../testData/domainApi";
import { Section } from "@/components/Section";
import { typedList } from "@/components/List";

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
        <DomainList.List batchSize={5}>
          <DomainList.LoaderAsync manualPagination manualSorting={false}>
            {loadDomains}
          </DomainList.LoaderAsync>
          <DomainList.Filter
            values={availableTypes}
            property="type"
            mode="all"
            name="Typ"
          />
          <DomainList.Search autoFocus />
          <DomainList.Sorting property="domain" name="A-Z" />
          <DomainList.Sorting property="domain" name="Z-A" direction="desc" />
          <DomainList.Sorting property="type" name="Typ" defaultEnabled />
          <DomainList.Sorting property="tld" name="TLD" />
          <DomainList.Item
            textValue={(domain) => domain.hostname}
            onAction={(domain) => console.log(domain.hostname)}
          >
            {(domain) => (
              <DomainList.ItemView>
                <Avatar variant={domain.type === "Domain" ? 1 : 2}>
                  {domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconSubdomain />
                  )}
                </Avatar>
                <Heading>
                  {domain.hostname}
                  {!domain.verified && (
                    <StatusBadge status="warning">Not verified</StatusBadge>
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

export const AsTable: Story = {
  render: () => {
    const DomainList = typedList<Domain>();
    const availableTypes = usePromise(getTypes, []);

    return (
      <Section>
        <Heading>Domains</Heading>
        <DomainList.List batchSize={5}>
          <DomainList.LoaderAsync manualPagination manualSorting={false}>
            {loadDomains}
          </DomainList.LoaderAsync>
          <DomainList.Filter
            values={availableTypes}
            property="type"
            mode="all"
            name="Typ"
          />
          <DomainList.Search autoFocus />
          <DomainList.Sorting property="domain" name="A-Z" />
          <DomainList.Sorting property="domain" name="Z-A" direction="desc" />
          <DomainList.Sorting property="type" name="Typ" defaultEnabled />
          <DomainList.Sorting property="tld" name="TLD" />

          <DomainList.Table aria-label="Domains">
            <DomainList.TableHeader>
              <DomainList.TableColumn>Name</DomainList.TableColumn>
              <DomainList.TableColumn>Type</DomainList.TableColumn>
              <DomainList.TableColumn>TLD</DomainList.TableColumn>
              <DomainList.TableColumn>Hostname</DomainList.TableColumn>
            </DomainList.TableHeader>

            <DomainList.TableBody>
              <DomainList.TableRow
                onAction={(domain) => console.log(domain.hostname)}
              >
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

          <DomainList.Item
            textValue={(domain) => domain.hostname}
            onAction={(domain) => console.log(domain.hostname)}
          >
            {(domain) => (
              <DomainList.ItemView>
                <Avatar variant={domain.type === "Domain" ? 1 : 2}>
                  {domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconSubdomain />
                  )}
                </Avatar>
                <Heading>
                  {domain.hostname}
                  {!domain.verified && (
                    <StatusBadge status="warning">Not verified</StatusBadge>
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
