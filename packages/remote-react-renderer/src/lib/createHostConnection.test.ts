import { createHostConnection } from "@/lib/createHostConnection";
import { RemoteReceiver } from "@mittwald/remote-dom-react/host";
import { describe, expect, test } from "vitest";

describe("createHostConnection", () => {
  test("forwards mutations to the receiver", () => {
    const receiver = new RemoteReceiver();
    const connection = createHostConnection(receiver);

    connection.mutate([
      [
        0,
        "~",
        {
          id: "test",
          type: 1,
          element: "flr-test",
          properties: {},
          attributes: {},
          eventListeners: {},
          children: [],
        },
        undefined,
      ],
    ]);

    expect(receiver.root.children).toHaveLength(1);
    expect(receiver.root.children[0]?.id).toBe("test");
  });

  test("rejects method calls on rendered elements", () => {
    const receiver = new RemoteReceiver();
    const connection = createHostConnection(receiver);

    expect(() =>
      connection.call("1", "insertAdjacentHTML", "beforeend", "<b>x</b>"),
    ).toThrow(
      "Remote elements rendered by the host do not support method calls (insertAdjacentHTML() on node 1)",
    );
  });
});
