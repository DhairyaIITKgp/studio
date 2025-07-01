import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-5 0-9-4.5-9-10 0-4.5 3.5-8.5 8-9.5" />
      <path d="M16 22c-2.5 0-4.5-1.5-5.5-4" />
      <path d="M16 2h6l-3.5 4.5" />
      <path d="M18.5 10.5c-1.5-.5-3.5-1-5.5-1" />
      <path d="M15 14c-2 0-4 1-5 2" />
      <path d="M14 18c-1.5 0-3 .5-4 1" />
    </svg>
  );
}
