import type { Content } from "./Content";
import type { ViewComponent } from "~/lib/viewComponentContext";

export * from "./Content";

declare global {
  interface FlowViewComponents {
    Field: {
      Content: ViewComponent<typeof Content>;
    };
  }
}
