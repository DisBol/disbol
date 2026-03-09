import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const BuildingStoreIcon = ({
  size = 20,
  className,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      {...props}
      className={className}
    >
      <g fill="none">
        <path
          fill="url(#SVGIH9hheJl)"
          d="M2 6.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z"
        ></path>
        <path
          fill="url(#SVGtHh0TdOD)"
          fillOpacity={0.8}
          d="M4 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15H4z"
        ></path>
        <path
          fill="url(#SVGohUsNeAJ)"
          fillOpacity={0.8}
          d="M9 9.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z"
        ></path>
        <path
          fill="url(#SVGW11LtdeX)"
          d="M7 2.5V1H4.5a.5.5 0 0 0-.312.11l-2.5 2c-.12.095-.164.24-.18.388L1.5 3.5v2a2.5 2.5 0 0 0 5 0v-2l-.417-.083z"
        ></path>
        <path
          fill="url(#SVGaEDFociw)"
          d="M14.493 3.499c-.015-.149-.06-.293-.18-.39l-2.5-2A.5.5 0 0 0 11.5 1H9v1.5l.917.917L9.5 3.5v2a2.5 2.5 0 0 0 5 0v-2z"
        ></path>
        <path
          fill="url(#SVGQUxYrdcs)"
          d="m9.5 1l1 2.5v2a2.5 2.5 0 0 1-5 0v-2l1-2.5z"
        ></path>
        <defs>
          <linearGradient
            id="SVGIH9hheJl"
            x1={5}
            x2={6.567}
            y1={6.818}
            y2={15.436}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.312} stopColor="#29c3ff"></stop>
            <stop offset={1} stopColor="#0094f0"></stop>
          </linearGradient>
          <linearGradient
            id="SVGtHh0TdOD"
            x1={4.143}
            x2={8.022}
            y1={10.125}
            y2={12.812}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0067bf"></stop>
            <stop offset={1} stopColor="#003580"></stop>
          </linearGradient>
          <linearGradient
            id="SVGohUsNeAJ"
            x1={9.9}
            x2={10.996}
            y1={8.667}
            y2={12.612}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fdfdfd"></stop>
            <stop offset={1} stopColor="#b3e0ff"></stop>
          </linearGradient>
          <linearGradient
            id="SVGW11LtdeX"
            x1={4.038}
            x2={4.038}
            y1={1}
            y2={4.063}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fb6f7b"></stop>
            <stop offset={1} stopColor="#d7257d"></stop>
          </linearGradient>
          <linearGradient
            id="SVGaEDFociw"
            x1={11.539}
            x2={11.539}
            y1={1}
            y2={4.063}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fb6f7b"></stop>
            <stop offset={1} stopColor="#d7257d"></stop>
          </linearGradient>
          <linearGradient
            id="SVGQUxYrdcs"
            x1={8}
            x2={8}
            y1={1}
            y2={4.063}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.304} stopColor="#ff9fb2"></stop>
            <stop offset={1} stopColor="#f97dbd"></stop>
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
};
