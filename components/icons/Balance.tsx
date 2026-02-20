import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const BalanceIcon = ({ size = 28, className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http:/ /www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        strokeWidth="4"
      >
        <path d="M35 25a32.23 32.23 0 0 0-22 0l-1-11c7-3 17-3 24 0zm-11-2l-3-5" />
        <path d="M42 39a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3z" />
        <path d="M29 23.455a32.2 32.2 0 0 0-10 0" />
      </g>
    </svg>
  );
};
