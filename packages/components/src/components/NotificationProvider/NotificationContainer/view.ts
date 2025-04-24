/* prettier-ignore */
import type { NotificationContainer } from "./NotificationContainer";
import type { ViewComponent } from "@/lib/viewComponentContext";

declare global {
  interface FlowViewComponents {
    NotificationContainer: ViewComponent<typeof NotificationContainer>;
  }
}
