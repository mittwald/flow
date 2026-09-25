/** @jsxImportSource @/app/remote-vue/_lib */
import {
  AlertIcon,
  Link,
  TabNavigation,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/tab-navigation`. */
export const TabNavigationDemo = defineComponent({
  name: "TabNavigationDemo",
  setup: () => () => (
    <TabNavigation aria-label="Project navigation">
      <Link href="#">Apps</Link>
      <Link href="#" aria-current="page">
        Container
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">E-Mails</Link>
      <Link href="#">
        Databases
        <AlertIcon status="warning" />
      </Link>
      <Link href="#">Backups</Link>
    </TabNavigation>
  ),
});
