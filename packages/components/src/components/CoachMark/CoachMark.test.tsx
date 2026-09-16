import { renderToStaticMarkup } from "react-dom/server";
import { CoachMark } from "@/components/CoachMark";
import { Text } from "@/components/Text";

/*
 * A coach mark opens itself, so a server renders it open — before anything has
 * measured the anchor. `useOverlayPosition` parks an unmeasured popover in the
 * top left corner, and that corner is what ships: the hint sits there until
 * hydration measures, then jumps to its anchor. It has to leave the server
 * hidden instead.
 */
test("A server-rendered coach mark is not painted before it is placed", () => {
  const markup = renderToStaticMarkup(
    <div>
      <button id="anchor">Anchor</button>
      <CoachMark anchor="anchor" defaultOpen>
        <Text>This button now does more.</Text>
      </CoachMark>
    </div>,
  );

  expect(markup).toContain("position:fixed;top:0;left:0");
  expect(markup).toContain("visibility:hidden");
});
