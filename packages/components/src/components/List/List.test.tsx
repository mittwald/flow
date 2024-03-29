import { render } from "@testing-library/react";
import { List } from "@/components/List";
import React from "react";
import { test } from "vitest";
import { I18nProvider } from "react-aria";

test("renders empty list without errors", () => {
  render(
    <I18nProvider locale="de">
      <List />
    </I18nProvider>,
  );
});
