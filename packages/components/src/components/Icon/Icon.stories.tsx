import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/Icon/Icon";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";

const meta: Meta<typeof Icon> = {
  component: Icon,
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const FontAwesomeIcon: Story = {
  args: { faIcon: faStar, "aria-label": "star" },
};

export const AnimatedFontAwesomeIcon: Story = {
  args: { faIcon: faStar, faAnimation: "bounce" },
};

export const CustomString: Story = {
  args: {
    children:
      "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IgoJIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTc0Ni43IDEyMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE3NDYuNyAxMjMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMTE3LjIsMjg1LjRjLTEwMi41LDAtMjI2LjUsNTIuMS0yOTEuMywxNjBjLTQ2LjctMTAwLjctMTM0LjgtMTYwLTI3Ni45LTE2MAoJCQkJYy0xMDEuNCwwLTIwMS4yLDUwLjgtMjU2LjEsMTI0LjFsLTI5LjgtMTUxLjNMMTcuNCwzMDYuM2wyOS45LDE1Mi4ybDAuMSwyLjRsLTAuMSw3NDEuM2gyNDAuOVY3MzYuNwoJCQkJYzAtMTE4LjcsNjEuMS0yMjIuOSwxODMuNC0yMjIuOUM2MDEsNTEzLjgsNjI4LDYwMS45LDYyOCw3MjAuNnY0ODEuOGgyNDAuOVY3MjcuN2MwLTExOC43LDY0LjctMjEzLjksMTgzLjQtMjEzLjkKCQkJCWMxMjcuNiwwLDE1Ni40LDg4LjEsMTU2LjQsMjA2Ljh2NDk5LjhsMjQwLjktNDcuMlY2OTBDMTQ0OS44LDQ1OS44LDEzNzAuNywyODUuNCwxMTE3LjIsMjg1LjR6Ii8+CgkJPC9nPgogICAgICAgIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNTY5LjIsMjMuN2MtODMsMC0xNTIuNCw2OS41LTE1Mi40LDE1NC4zYzAsODMsNjkuNSwxNTIuNCwxNTIuNCwxNTIuNGM4NC45LDAsMTU0LjQtNjkuNSwxNTQuNC0xNTIuNAoJCQlDMTcyMy41LDkzLjEsMTY1NC4xLDIzLjcsMTU2OS4yLDIzLjd6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==",
  },
};

export const CustomSvg: Story = {
  args: {
    children: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
        <path d="m296.47,0c-24.47.11-47.84,2.2-68.4,5.84-60.57,10.7-71.57,33.1-71.57,74.41v54.55h143.14v18.18H102.78c-41.6,0-78.03,25-89.42,72.57C.21,280.08-.37,314.11,13.35,371.04c10.17,42.38,34.47,72.57,76.08,72.57h49.22v-65.4c0-47.25,40.88-88.92,89.42-88.92h142.97c39.8,0,71.57-32.77,71.57-72.74V80.25c0-38.79-32.73-67.93-71.57-74.41C346.45,1.75,320.94-.11,296.47,0Zm-77.41,43.88c14.79,0,26.86,12.27,26.86,27.36,0,15.04-12.07,27.19-26.86,27.19-14.84,0-26.86-12.16-26.86-27.19s12.02-27.36,26.86-27.36Z" />
        <path d="m460.46,152.99v63.56c0,49.28-41.78,90.76-89.42,90.76h-142.97c-39.16,0-71.57,33.52-71.57,72.74v136.3c0,38.79,33.73,61.61,71.57,72.74,45.31,13.32,88.76,15.73,142.97,0,36.04-10.43,71.57-31.43,71.57-72.74v-54.55h-142.97v-18.18h214.55c41.6,0,57.1-29.02,71.57-72.57,14.94-44.84,14.31-87.96,0-145.48-10.28-41.41-29.92-72.57-71.57-72.57h-53.72Zm-80.41,345.17c14.84,0,26.86,12.16,26.86,27.19s-12.02,27.36-26.86,27.36-26.86-12.27-26.86-27.36,12.07-27.19,26.86-27.19Z" />
      </svg>
    ),
  },
};
