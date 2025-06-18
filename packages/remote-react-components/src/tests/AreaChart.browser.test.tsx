import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AreaChart is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const areaChart = dom.getByTestId("areaChart");
  await expect.element(areaChart).toBeInTheDocument();
  expect(areaChart.element()).toMatchInlineSnapshot(`
    <svg
      class="recharts-surface"
      data-testid="areaChart"
      height="400"
      role="application"
      style="width: 100%; height: 100%;"
      tabindex="0"
      viewBox="0 0 414 400"
      width="414"
    >
      <title />
      <desc />
      <defs>
        <clippath
          id="recharts1-clip"
        >
          <rect
            height="390"
            width="404"
            x="5"
            y="5"
          />
        </clippath>
      </defs>
      <g
        class="recharts-layer recharts-area"
      >
        <g
          class="recharts-layer"
        >
          <defs>
            <clippath
              id="animationClipPath-recharts-area-2"
            >
              <rect
                height="396"
                width="0"
                x="5"
                y="0"
              />
            </clippath>
          </defs>
          <g
            class="recharts-layer"
            clip-path="url(#animationClipPath-recharts-area-2)"
          >
            <g
              class="recharts-layer"
            >
              <path
                class="recharts-curve recharts-area-area"
                d="M5,5L409,200L409,395L5,395Z"
                fill="none"
                fill-opacity="1"
                height="390"
                stroke="none"
                width="404"
              />
            </g>
          </g>
        </g>
      </g>
      <g
        class="recharts-layer recharts-active-dot"
      >
        <svg
          fill="none"
          height="14"
          viewBox="0 0 14 14"
          width="14"
          x="-2"
          xmlns="http://www.w3.org/2000/svg"
          y="-2"
        >
          <circle
            cx="7"
            cy="7"
            fill="white"
            r="7"
          />
          <circle
            cx="7"
            cy="7"
            fill="white"
            r="4"
            stroke="#0fb5ae"
            stroke-width="2"
          />
        </svg>
      </g>
    </svg>
  `);
});
