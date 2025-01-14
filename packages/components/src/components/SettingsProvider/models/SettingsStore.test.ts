import { SettingsStore } from "~/components/SettingsProvider/models/SettingsStore";
import z from "zod";

const schema = z.array(z.string());
const settingValue = ["bar", "baz"];

test("Serialization of Store works", () => {
  const store = new SettingsStore();
  store.set("List", "Foo", schema, settingValue);

  const storeClone = SettingsStore.fromJson(store.asJson);
  expect(storeClone.get("List", "Foo", schema)).toEqual(settingValue);
});
