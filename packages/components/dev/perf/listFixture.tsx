import { useState, type FC, type ReactNode } from "react";
import { ListItemView, typedList, useList } from "@/components/List";
import type List from "@/components/List/model/List";
import { Avatar } from "@/components/Avatar";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import AlertBadge from "@/components/AlertBadge";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
import { counters, defined } from "./harness";

export interface Domain {
  id: string;
  hostname: string;
  domain: string;
  type: "Subdomain" | "Domain";
  verified: boolean;
  tld: string;
  createdAt: string;
}

const tlds = ["de", "com", "net", "org", "io", "shop", "eu", "at", "ch", "dev"];
const words = [
  "alpha",
  "bravo",
  "charlie",
  "delta",
  "echo",
  "foxtrot",
  "golf",
  "hotel",
  "india",
  "juliett",
  "kilo",
  "lima",
  "mike",
  "november",
  "oscar",
  "papa",
  "quebec",
  "romeo",
  "sierra",
  "tango",
  "uniform",
  "victor",
  "whiskey",
];

export const generateDomains = (n: number): Domain[] =>
  Array.from({ length: n }, (_, i) => {
    const word = `${words[i % words.length]}-${words[(i * 7) % words.length]}`;
    const tld = tlds[i % tlds.length] ?? "de";
    const isSub = i % 3 === 0;
    const domain = `${word}${i}.${tld}`;
    return {
      id: `d${i}`,
      domain,
      hostname: isSub ? `www.${domain}` : domain,
      type: isSub ? "Subdomain" : "Domain",
      verified: i % 5 !== 0,
      tld,
      createdAt: new Date(2020, 0, 1 + ((i * 37) % 2000)).toISOString(),
    };
  });

declare global {
  /* The rendered list's model, so scenarios can sort, filter and page. */
  var __list: List<Domain> | undefined;
}

export const list = (): List<Domain> => defined(globalThis.__list, "list");

export const search = () => defined(list().search, "List.Search");

/** 0: A–Z (default), 1: Z–A, 2: created */
export const sorting = (index: 0 | 1 | 2) =>
  defined(list().sorting[index], `sorting ${index}`);

export const filterValue = (property: keyof Domain, value: unknown) =>
  defined(
    list()
      .filters.find((f) => f.property === property)
      ?.values.find((v) => v.value === value),
    `filter value ${property}=${String(value)}`,
  );

export const clickRerender = () =>
  defined(
    document.querySelector<HTMLButtonElement>("[data-testid=rerender]"),
    "re-render button",
  ).click();

/** Rendered rows in list, tiles and table view (table header excluded). */
export const rows = () =>
  document.querySelectorAll(
    '[role="grid"] [role="row"]:not(:has([role="columnheader"]))',
  ).length;

const ListProbe: FC = () => {
  globalThis.__list = useList<Domain>();
  return null;
};

const DomainList = typedList<Domain>();

const renderDomain = (domain: Domain): ReactNode => {
  counters.itemRenders++;
  return (
    <ListItemView>
      <Avatar color={domain.type === "Domain" ? "blue" : "teal"}>
        {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
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
    </ListItemView>
  );
};

const renderSimple = (domain: Domain): ReactNode => {
  counters.itemRenders++;
  return (
    <ListItemView>
      <Heading>{domain.hostname}</Heading>
    </ListItemView>
  );
};

export interface FixtureProps {
  data: Domain[];
  batchSize?: number;
  /** Inline: new render function on every parent render (common in apps) */
  renderFn?: "inline" | "hoisted";
  content?: "rich" | "simple" | "plain";
  table?: boolean;
  infiniteScroll?: boolean;
  defaultViewMode?: "list" | "tiles" | "table";
}

export const Fixture: FC<FixtureProps> = (props) => {
  const {
    data,
    batchSize,
    renderFn = "inline",
    content = "rich",
    table,
    infiniteScroll,
    defaultViewMode,
  } = props;
  const [counter, setCounter] = useState(0);

  const hoisted =
    content === "rich"
      ? renderDomain
      : content === "simple"
        ? renderSimple
        : renderPlain;

  return (
    <>
      <button data-testid="rerender" onClick={() => setCounter((c) => c + 1)}>
        rerender {counter}
      </button>
      <DomainList.List
        aria-label="Domains"
        batchSize={batchSize}
        infiniteScroll={infiniteScroll}
        defaultViewMode={defaultViewMode}
        onAction={renderFn === "inline" ? () => undefined : noop}
      >
        <ListProbe />
        <DomainList.StaticData data={data} />
        <DomainList.Filter property="type" name="Type" />
        <DomainList.Filter property="tld" name="TLD" mode="one" />
        <DomainList.Filter property="verified" name="Verified" mode="one" />
        <DomainList.Search autoSubmit={false} />
        <DomainList.Sorting
          property="hostname"
          name="A-Z"
          defaultEnabled
          directionName="asc"
        />
        <DomainList.Sorting
          property="hostname"
          name="Z-A"
          direction="desc"
          directionName="desc"
        />
        <DomainList.Sorting property="createdAt" name="Created" />
        {table && (
          <DomainList.Table>
            <DomainList.TableHeader>
              <DomainList.TableColumn>Hostname</DomainList.TableColumn>
              <DomainList.TableColumn>Type</DomainList.TableColumn>
              <DomainList.TableColumn>TLD</DomainList.TableColumn>
              <DomainList.TableColumn>Created</DomainList.TableColumn>
            </DomainList.TableHeader>
            <DomainList.TableBody>
              <DomainList.TableRow>
                <DomainList.TableCell>
                  {(d) => {
                    counters.itemRenders++;
                    return d.hostname;
                  }}
                </DomainList.TableCell>
                <DomainList.TableCell>{(d) => d.type}</DomainList.TableCell>
                <DomainList.TableCell>{(d) => d.tld}</DomainList.TableCell>
                <DomainList.TableCell>
                  {(d) => d.createdAt}
                </DomainList.TableCell>
              </DomainList.TableRow>
            </DomainList.TableBody>
          </DomainList.Table>
        )}
        <DomainList.Item
          showTiles
          textValue={renderFn === "inline" ? (d) => d.hostname : textValue}
        >
          {renderFn === "inline" ? (d) => hoisted(d) : hoisted}
        </DomainList.Item>
      </DomainList.List>
    </>
  );
};

const textValue = (d: Domain) => d.hostname;
const noop = () => undefined;

const renderPlain = (domain: Domain): ReactNode => {
  counters.itemRenders++;
  return <span>{domain.hostname}</span>;
};
