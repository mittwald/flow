import {
  List,
  ListItem,
  ListItemView,
  ListStaticData,
  typedList,
} from "@/components/List";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { describe, expect, test, vi } from "vitest";
import { commands, page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

interface Data {
  num: number;
}

/*
 * These tests drag the mouse to create a real text selection — nothing else
 * does. Parallel test files share one page and one cursor, so they live in the
 * `browser-mouse` project, which runs its files one at a time.
 */
describe("Text selection", () => {
  const heading = "example.com";
  const subTitle = "Subtitle";
  const headingSelector =
    ".flow--list--list-item-view--title .flow--heading--heading-text";
  const subTitleSelector = ".flow--list--list-item-view--sub-title .flow--text";

  const TextSelectionList = (props: { onAction: () => void }) => (
    <List aria-label="Test" onAction={props.onAction}>
      <ListStaticData<Data> data={[{ num: 42 }]} />
      <ListItem<Data> textValue={() => heading}>
        {() => (
          <ListItemView>
            <Heading>{heading}</Heading>
            <Text>{subTitle}</Text>
          </ListItemView>
        )}
      </ListItem>
    </List>
  );

  const selectedText = () => String(window.getSelection());

  test("selecting the heading with the mouse does not trigger the item action", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);
    await expect.element(page.getByText(heading)).toBeInTheDocument();

    await commands.selectTextByDragging(headingSelector);

    expect(selectedText()).toBe(heading);
    expect(onAction).not.toHaveBeenCalled();
  });

  // The title box hugs the text exactly, so without its padding a drag has to
  // hit the text pixel for pixel.
  test("starting the drag beside the text still selects it", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);
    await expect.element(page.getByText(heading)).toBeInTheDocument();

    await commands.selectTextByDragging(headingSelector, 4);

    expect(selectedText()).toBe(heading);
    expect(onAction).not.toHaveBeenCalled();
  });

  test("selecting the subtitle with the mouse does not trigger the item action", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);
    await expect.element(page.getByText(subTitle)).toBeInTheDocument();

    await commands.selectTextByDragging(subTitleSelector);

    expect(selectedText()).toBe(subTitle);
    expect(onAction).not.toHaveBeenCalled();
  });

  test("clicking the heading triggers the item action", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);

    await userEvent.click(page.getByText(heading));

    expect(onAction).toHaveBeenCalledOnce();
  });

  // The browser keeps a selection alive across mousedown and mouseup so it can
  // be dragged, so this click still sees it – it just did not create it.
  test("clicking inside an existing selection triggers the item action", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);
    await expect.element(page.getByText(heading)).toBeInTheDocument();
    await commands.selectTextByDragging(headingSelector);

    await userEvent.click(page.getByText(heading));

    expect(onAction).toHaveBeenCalledOnce();
  });

  /*
   * The row's bottom padding carries no text, so these drags select nothing —
   * the empty-selection assertion is what keeps that true.
   */
  describe("Dragging without selecting text", () => {
    const bottomPaddingDrag = (distance: number) => {
      const row = page.getByRole("row").element().getBoundingClientRect();
      const y = row.bottom - 4;
      return commands.dragMouse(
        { x: row.left + 20, y },
        { x: row.left + 20 + distance, y },
      );
    };

    test("dragging across the item does not trigger the item action", async () => {
      const onAction = vi.fn();
      await render(<TextSelectionList onAction={onAction} />);
      await expect.element(page.getByText(heading)).toBeInTheDocument();

      await bottomPaddingDrag(60);

      expect(selectedText()).toBe("");
      expect(onAction).not.toHaveBeenCalled();
    });

    test("a click that wobbles a few pixels still triggers the item action", async () => {
      const onAction = vi.fn();
      await render(<TextSelectionList onAction={onAction} />);
      await expect.element(page.getByText(heading)).toBeInTheDocument();

      await bottomPaddingDrag(4);

      expect(selectedText()).toBe("");
      expect(onAction).toHaveBeenCalledOnce();
    });
  });

  describe("Table view", () => {
    const cellSelector = ".flow--table--cell";

    const TypedList = typedList<Data>();

    const TableList = (props: { onAction: () => void }) => (
      <TypedList.List
        aria-label="Test"
        defaultViewMode="table"
        onAction={props.onAction}
      >
        <TypedList.StaticData data={[{ num: 42 }]} />
        <TypedList.Table>
          <TypedList.TableHeader>
            <TypedList.TableColumn>Name</TypedList.TableColumn>
          </TypedList.TableHeader>
          <TypedList.TableBody>
            <TypedList.TableRow>
              <TypedList.TableCell>{() => heading}</TypedList.TableCell>
            </TypedList.TableRow>
          </TypedList.TableBody>
        </TypedList.Table>
      </TypedList.List>
    );

    test("selecting a cell with the mouse does not trigger the row action", async () => {
      const onAction = vi.fn();
      await render(<TableList onAction={onAction} />);
      await expect.element(page.getByText(heading)).toBeInTheDocument();

      await commands.selectTextByDragging(cellSelector);

      expect(selectedText()).toBe(heading);
      expect(onAction).not.toHaveBeenCalled();
    });

    test("clicking a cell triggers the row action", async () => {
      const onAction = vi.fn();
      await render(<TableList onAction={onAction} />);

      await userEvent.click(page.getByText(heading));

      expect(onAction).toHaveBeenCalledOnce();
    });
  });

  test("activating the item with the keyboard triggers the item action", async () => {
    const onAction = vi.fn();
    await render(<TextSelectionList onAction={onAction} />);
    await expect.element(page.getByText(heading)).toBeInTheDocument();
    await commands.selectTextByDragging(headingSelector);

    page.getByRole("row").element().focus();
    await userEvent.keyboard("{Enter}");

    expect(onAction).toHaveBeenCalledOnce();
  });
});
