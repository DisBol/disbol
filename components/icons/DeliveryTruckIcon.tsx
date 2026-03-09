import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const DeliveryTruckIcon = ({
  size = 20,
  className,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      {...props}
      className={className}
    >
      <path
        fill="#dd2e44"
        d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z"
      ></path>
      <path
        fill="#ffcc4d"
        d="m19 13l-.979-1H7.146C4 12 3 14 3 14l-3 5.959V25h19z"
      ></path>
      <path fill="#55acee" d="M9 20H2l2-4s1-2 3-2h2z"></path>
      <circle cx={9} cy={31} r={4} fill="#292f33"></circle>
      <circle cx={9} cy={31} r={2} fill="#ccd6dd"></circle>
      <circle cx={27} cy={31} r={4} fill="#292f33"></circle>
      <circle cx={27} cy={31} r={2} fill="#ccd6dd"></circle>
      <path
        fill="#ccd6dd"
        d="M32 8H17a4 4 0 0 0-4 4v13h23V12a4 4 0 0 0-4-4"
      ></path>
    </svg>
  );
};
