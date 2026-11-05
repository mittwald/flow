import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";
import { Version } from "@mittwald/flow-remote-core";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mittwald/remote-dom-react/host";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

interface TestComponentProps {
  dangerouslySetInnerHTML?: { __html: string };
  id?: string;
}

const TestComponent = (props: TestComponentProps) => <div {...props} />;

describe("createFlowRemoteComponentRenderer", () => {
  test("drops props that are not component props", () => {
    const receiver = new RemoteReceiver();
    receiver.connection.mutate([
      [
        0,
        "~",
        {
          id: "test",
          type: 1,
          element: "flr-test",
          properties: {
            dangerouslySetInnerHTML: { __html: "<b>x</b>" },
            id: "component",
            "data-flr-initialized": true,
            "data-flr-version": Version.v3,
          },
          attributes: {},
          eventListeners: {},
          children: [],
        },
        undefined,
      ],
    ]);

    const components = new Map([
      ["flr-test", createFlowRemoteComponentRenderer("Test", TestComponent)],
    ]);

    expect(
      renderToStaticMarkup(
        <RemoteRootRenderer receiver={receiver} components={components} />,
      ),
    ).toBe('<div id="component"></div>');
  });
});
