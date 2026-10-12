import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { SkeletonText } from "@/components/SkeletonText";
import styles from "./SkeletonText.module.scss";

test("keeps the skeleton class next to a consumer className", async () => {
  await render(<SkeletonText className="consumer-class" />);

  expect(document.querySelector(".consumer-class")).toHaveClass(
    styles.skeletonText,
  );
});
