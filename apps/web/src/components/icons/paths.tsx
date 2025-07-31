import { PathStyle } from "@buzztrip/backend/types";
import type { SVGProps } from "react";

interface PathIconProps extends SVGProps<SVGSVGElement> {
  styles: PathStyle;
}

const Circle = (props: SVGProps<SVGCircleElement>) => {
  return (
    <circle {...props} r="0.9" fill="white" stroke="black" stroke-width="0.2" />
  );
};

export const LineIcon = (props: PathIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={props.styles.fillColor}
      fillOpacity={props.styles.fillOpacity}
    >
      <path
        d="M22 20L2 4"
        stroke={props.styles.strokeColor ?? "black"}
        strokeOpacity={props.styles.strokeOpacity}
        stroke-width="0.75"
      />
      <Circle cx="2" cy="4" r="0.9" />
      <Circle cx="22" cy="20" r="0.9" />
    </svg>
  );
};

export const PolygonIcon = (props: PathIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={props.styles.fillColor}
      fillOpacity={props.styles.fillOpacity}
    >
      <path
        d="M8 4L4 18L12 22L20 14L15 10"
        stroke={props.styles.strokeColor ?? "black"}
        strokeOpacity={props.styles.strokeOpacity}
        stroke-width="0.75"
        stroke-linecap="round"
      />
      <Circle cx="8" cy="4" r="0.9" />
      <Circle cx="4" cy="18" r="0.9" />
      <Circle cx="12" cy="22" r="0.9" />
      <Circle cx="20" cy="14" r="0.9" />
    </svg>
  );
};

export const Polygon2Icon = (props: PathIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={props.styles.fillColor}
      fillOpacity={props.styles.fillOpacity}
    >
      <path
        d="M12 22L4 18V9L8 4L17 7L20 14L12 22Z"
        stroke={props.styles.strokeColor ?? "black"}
        strokeOpacity={props.styles.strokeOpacity}
        stroke-width="0.75"
        stroke-linecap="round"
      />
      <Circle cx="8" cy="4" r="0.9" />
      <Circle cx="4" cy="18" r="0.9" />
      <Circle cx="12" cy="22" r="0.9" />
      <Circle cx="20" cy="14" r="0.9" />
      <Circle cx="17" cy="7" r="0.9" />
      <Circle cx="4" cy="9" r="0.9" />
    </svg>
  );
};

export const CircleIcon = (props: PathIconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill={props.styles.fillColor}
        fillOpacity={props.styles.fillOpacity}
        stroke={props.styles.strokeColor ?? "black"}
        strokeOpacity={props.styles.strokeOpacity}
        stroke-width="2"
        stroke-opacity="0.8"
      />

      <Circle cx="50" cy="20" r="0.9" />

      <Circle cx="80" cy="50" r="0.9" />
      <Circle cx="50" cy="80" r="0.9" />
      <Circle cx="20" cy="50" r="0.9" />
    </svg>
  );
};

export const RectangleIcon = (props: PathIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={props.styles.fillColor}
      fillOpacity={props.styles.fillOpacity}
    >
      <path
        d="M22 4V20H2V4H22Z"
        stroke={props.styles.strokeColor ?? "black"}
        strokeOpacity={props.styles.strokeOpacity}
      />
      <Circle cx="2" cy="20" r="0.9" />
      <Circle cx="2" cy="4" r="0.9" />
      <Circle cx="22" cy="4" r="0.9" />
      <Circle cx="22" cy="20" r="0.9" />
    </svg>
  );
};
