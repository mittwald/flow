import type { FC } from "react";
import clsx from "clsx";

interface Props {
  className?: string;
}

export const ExampleSvg: FC<Props> = ({ className }) => (
  <svg
    aria-hidden="false"
    focusable="false"
    data-prefix="fas"
    data-icon="circle-info"
    className={clsx("svg-inline--fa", className)}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    aria-label="Information"
  >
    <path
      fill="currentColor"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
    ></path>
  </svg>
);

export default ExampleSvg;
