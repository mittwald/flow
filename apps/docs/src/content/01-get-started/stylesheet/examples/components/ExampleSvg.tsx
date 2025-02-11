import type { FC } from "react";
import clsx from "clsx";

interface Props {
  className?: string;
}

export const ExampleSvg: FC<Props> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={clsx(className, "tabler-icon tabler-icon-info-circle")}
    focusable="false"
    role="img"
    aria-hidden="false"
    aria-label="Status Information"
  >
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
    <path d="M12 9h.01"></path>
    <path d="M11 12h1v4h1"></path>
  </svg>
);

export default ExampleSvg;
