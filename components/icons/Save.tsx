import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const SaveIcon = ({ size = 20, className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <defs>
        <path id="SVGhOKll5Tg" d="M12 3H7v4h5zM7 21h10v-6H7z" />
      </defs>
      <g fill="none">
        <path d="M3 3h13l5 5v13H3z" />
        <use href="#SVGhOKll5Tg" />
        <use href="#SVGhOKll5Tg" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" d="M3 3h13l5 5v13H3z" />
      </g>
    </svg>
  );
};
