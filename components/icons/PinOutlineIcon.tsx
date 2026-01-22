import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const PinOutlineIcon = ({
  size = 20,
  className,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 15 15"
      className={className}
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="square"
        clipRule="evenodd"
        strokeWidth="1"
      >
        <path d="M7.5 8.495a2 2 0 0 0 2-1.999a2 2 0 0 0-4 0a2 2 0 0 0 2 1.999Z" />
        <path d="M13.5 6.496c0 4.997-5 7.995-6 7.995s-6-2.998-6-7.995A6 6 0 0 1 7.5.5c3.313 0 6 2.685 6 5.996Z" />
      </g>
    </svg>
  );
};
