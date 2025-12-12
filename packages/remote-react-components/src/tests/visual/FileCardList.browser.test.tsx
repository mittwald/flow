import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "FileCardList (%s)",
  async ({ container, render, components: { FileCardList, FileCard } }) => {
    await render(
      <FileCardList>
        <FileCard name="file1.txt" />
        <FileCard name="file2.txt" />
        <FileCard name="file3.txt" />
        <FileCard name="file4.txt" />
        <FileCard name="file5.txt" />
      </FileCardList>,
    );

    await expect(container).toMatchScreenshot("FileCardList");
  },
);
