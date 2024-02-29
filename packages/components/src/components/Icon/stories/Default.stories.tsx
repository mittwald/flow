import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/Icon/Icon";
import React from "react";
import { IconStar } from "@tabler/icons-react";
import { IconProject } from "@/components/Icon/components/icons";

const meta: Meta<typeof Icon> = {
  title: "Content/Icon",
  component: Icon,
  parameters: {
    controls: { exclude: ["tablerIcon"] },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Alias: Story = {
  args: { "aria-label": "project" },
  render: (props) => <IconProject {...props} />,
};

export const TablerIcon: Story = {
  args: { "aria-label": "star" },
  render: (props) => (
    <Icon {...props}>
      <IconStar />
    </Icon>
  ),
};

export const CustomSvgString: Story = {
  render: (props) => (
    <Icon {...props}>{`\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1746.7 1232" class="flow-icon" focusable="false" role="img" aria-hidden="true">
    <g>
        <g>
            <g>
                <path class="st0" d="M1117.2,285.4c-102.5,0-226.5,52.1-291.3,160c-46.7-100.7-134.8-160-276.9-160 c-101.4,0-201.2,50.8-256.1,124.1l-29.8-151.3L17.4,306.3l29.9,152.2l0.1,2.4l-0.1,741.3h240.9V736.7 c0-118.7,61.1-222.9,183.4-222.9C601,513.8,628,601.9,628,720.6v481.8h240.9V727.7c0-118.7,64.7-213.9,183.4-213.9 c127.6,0,156.4,88.1,156.4,206.8v499.8l240.9-47.2V690C1449.8,459.8,1370.7,285.4,1117.2,285.4z"></path>
            </g>
            <path class="st0" d="M1569.2,23.7c-83,0-152.4,69.5-152.4,154.3c0,83,69.5,152.4,152.4,152.4c84.9,0,154.4-69.5,154.4-152.4 C1723.5,93.1,1654.1,23.7,1569.2,23.7z"></path>
        </g>
    </g>
</svg>`}</Icon>
  ),
};

export const CustomSvg: Story = {
  render: (props) => (
    <Icon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
        <path d="m296.47,0c-24.47.11-47.84,2.2-68.4,5.84-60.57,10.7-71.57,33.1-71.57,74.41v54.55h143.14v18.18H102.78c-41.6,0-78.03,25-89.42,72.57C.21,280.08-.37,314.11,13.35,371.04c10.17,42.38,34.47,72.57,76.08,72.57h49.22v-65.4c0-47.25,40.88-88.92,89.42-88.92h142.97c39.8,0,71.57-32.77,71.57-72.74V80.25c0-38.79-32.73-67.93-71.57-74.41C346.45,1.75,320.94-.11,296.47,0Zm-77.41,43.88c14.79,0,26.86,12.27,26.86,27.36,0,15.04-12.07,27.19-26.86,27.19-14.84,0-26.86-12.16-26.86-27.19s12.02-27.36,26.86-27.36Z" />
        <path d="m460.46,152.99v63.56c0,49.28-41.78,90.76-89.42,90.76h-142.97c-39.16,0-71.57,33.52-71.57,72.74v136.3c0,38.79,33.73,61.61,71.57,72.74,45.31,13.32,88.76,15.73,142.97,0,36.04-10.43,71.57-31.43,71.57-72.74v-54.55h-142.97v-18.18h214.55c41.6,0,57.1-29.02,71.57-72.57,14.94-44.84,14.31-87.96,0-145.48-10.28-41.41-29.92-72.57-71.57-72.57h-53.72Zm-80.41,345.17c14.84,0,26.86,12.16,26.86,27.19s-12.02,27.36-26.86,27.36-26.86-12.27-26.86-27.36,12.07-27.19,26.86-27.19Z" />
      </svg>
    </Icon>
  ),
};
