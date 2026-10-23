import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, expect, test } from "vitest";
import { useState, type FC, type ReactNode } from "react";
import {
  List,
  ListItem,
  ListItemView,
  ListSorting,
  ListStaticData,
  useList,
} from "@/components/List";
import type ListModel from "@/components/List/model/List";
import { Avatar } from "@/components/Avatar";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import AlertBadge from "@/components/AlertBadge";
import { IconDomain } from "@/components/Icon/components/icons";
import { countFibers } from "@/lib/dev/fiberTree";

/*
 * Render cost of List items as counts, not timings: what an item weighs and
 * which changes run its render function. Each count scales with the number of
 * visible items, so a regression here multiplies in every list.
 */

interface Domain {
  id: number;
  hostname: string;
}

const hostname = (id: number) => `domain-${String(id).padStart(3, "0")}.de`;

const domains = (count: number): Domain[] =>
  Array.from({ length: count }, (_, id) => ({ id, hostname: hostname(id) }));

let itemRenders = 0;

/* The typical mStudio item: avatar, heading with badge, text, context menu. */
const renderRichItem = (domain: Domain): ReactNode => {
  itemRenders++;
  return (
    <ListItemView>
      <Avatar color="blue">
        <IconDomain />
      </Avatar>
      <Heading>
        {domain.hostname}
        <AlertBadge status="warning">Not verified</AlertBadge>
      </Heading>
      <Text>Domain</Text>
      <ContextMenu>
        <MenuItem>Show details</MenuItem>
        <MenuItem>Delete</MenuItem>
      </ContextMenu>
    </ListItemView>
  );
};

const renderSimpleItem = (domain: Domain): ReactNode => {
  itemRenders++;
  return (
    <ListItemView>
      <Heading>{domain.hostname}</Heading>
    </ListItemView>
  );
};

const textValue = (domain: Domain) => domain.hostname;
const onAction = () => undefined;

let listModel: ListModel<Domain> | undefined;

const ListModelProbe: FC = () => {
  listModel = useList<Domain>();
  return null;
};

const sortDescending = () => {
  const sorting = listModel?.sorting[1];
  if (!sorting) {
    throw new Error("The list has no second sorting");
  }
  sorting.enable();
};

interface DomainListProps {
  data: Domain[];
  renderItem: (domain: Domain) => ReactNode;
}

/* Everything the list receives is stable, so a re-render changes nothing. */
const DomainList: FC<DomainListProps> = ({ data, renderItem }) => {
  const [renders, setRenders] = useState(0);
  return (
    <>
      <button onClick={() => setRenders((r) => r + 1)}>
        Re-render {renders}
      </button>
      <List aria-label="Domains" batchSize={data.length} onAction={onAction}>
        <ListModelProbe />
        <ListStaticData<Domain> data={data} />
        <ListSorting<Domain> property="hostname" name="A-Z" defaultEnabled />
        <ListSorting<Domain> property="hostname" name="Z-A" direction="desc" />
        <ListItem<Domain> textValue={textValue}>{renderItem}</ListItem>
      </List>
    </>
  );
};

const renderList = async (
  count: number,
  renderItem: (domain: Domain) => ReactNode = renderRichItem,
) => {
  const screen = await render(
    <DomainList data={domains(count)} renderItem={renderItem} />,
  );
  await expect.element(page.getByText(hostname(count - 1))).toBeInTheDocument();
  return screen;
};

describe("Weight of an item", () => {
  /*
   * The difference between 11 items and 1 item, divided by 10, leaves out what
   * the list itself renders.
   */
  const costPerItem = async (renderItem: (domain: Domain) => ReactNode) => {
    const measure = async (count: number) => {
      const { container, unmount } = await renderList(count, renderItem);
      const cost = {
        fibers: countFibers(container),
        domNodes: container.getElementsByTagName("*").length,
      };
      await unmount();
      return cost;
    };
    const one = await measure(1);
    const eleven = await measure(11);
    return {
      fibers: (eleven.fibers - one.fibers) / 10,
      domNodes: (eleven.domNodes - one.domNodes) / 10,
    };
  };

  /*
   * The ceilings sit a little above the counts of 2026-10: rich 336 fibers and
   * 34 DOM nodes, simple 89 and 12. A failure prints the new count.
   * - Heavier: find the component that grew. Raise the ceiling only for a
   *   deliberate cost, and say why in the PR.
   * - Lighter: lower the ceiling along with the change, so the gain stays.
   *   Lower it below the expected count once to read the new count.
   */
  const expectCostPerItem = async (
    renderItem: (domain: Domain) => ReactNode,
    ceiling: { fibers: number; domNodes: number },
  ) => {
    const cost = await costPerItem(renderItem);
    expect(cost.fibers, "React fibers per item").toBeLessThanOrEqual(
      ceiling.fibers,
    );
    expect(cost.domNodes, "DOM nodes per item").toBeLessThanOrEqual(
      ceiling.domNodes,
    );
  };

  test("a rich item stays within its ceiling", async () => {
    await expectCostPerItem(renderRichItem, { fibers: 340, domNodes: 35 });
  });

  test("a simple item stays within its ceiling", async () => {
    await expectCostPerItem(renderSimpleItem, { fibers: 92, domNodes: 13 });
  });
});

/*
 * With stable render functions, `textValue` and `onAction` the memoized item
 * has nothing to re-render for.
 */
describe("Item render functions", () => {
  test("a parent re-render calls none of them", async () => {
    await renderList(20);
    itemRenders = 0;

    await page.getByRole("button", { name: "Re-render 0" }).click();
    await expect
      .element(page.getByRole("button", { name: "Re-render 1" }))
      .toBeInTheDocument();

    expect(itemRenders).toBe(0);
  });

  test("sorting calls none of them", async () => {
    await renderList(20);
    itemRenders = 0;

    sortDescending();
    await expect
      .element(page.getByRole("row").first())
      .toHaveTextContent(hostname(19));

    expect(itemRenders).toBe(0);
  });
});
