import { PathStyle } from "@buzztrip/backend/types";
import type { SVGProps } from "react";

export interface PathIconProps extends SVGProps<SVGSVGElement> {
  styles: PathStyle;
  size?: number;
}

const getSizeProps = (size?: number) => ({
  width: size ?? 24,
  height: size ?? 24,
});

// Fixed Circle component with proper strokeWidth
const Circle = (props: SVGProps<SVGCircleElement>) => {
  return (
    <circle {...props} r="0.9" fill="white" stroke="black" strokeWidth="0.2" />
  );
};

export const LineIcon = ({ styles, size, ...rest }: PathIconProps) => {
  return (
    <svg
      {...getSizeProps(size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={styles.fillColor}
      fillOpacity={styles.fillOpacity}
      {...rest}
    >
      <path
        d="M22 20L2 4"
        stroke={styles.strokeColor ?? "black"}
        strokeOpacity={styles.strokeOpacity}
        strokeWidth="0.75"
      />
      <Circle cx="2" cy="4" />
      <Circle cx="22" cy="20" />
    </svg>
  );
};

export const PolygonIcon = ({ styles, size, ...rest }: PathIconProps) => {
  return (
    <svg
      {...getSizeProps(size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={styles.fillColor}
      fillOpacity={styles.fillOpacity}
      {...rest}
    >
      <path
        d="M8 4L4 18L12 22L20 14L15 10"
        stroke={styles.strokeColor ?? "black"}
        strokeOpacity={styles.strokeOpacity}
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <Circle cx="8" cy="4" />
      <Circle cx="4" cy="18" />
      <Circle cx="12" cy="22" />
      <Circle cx="20" cy="14" />
    </svg>
  );
};

export const Polygon2Icon = ({ styles, size, ...rest }: PathIconProps) => {
  return (
    <svg
      {...getSizeProps(size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={styles.fillColor}
      fillOpacity={styles.fillOpacity}
      {...rest}
    >
      <path
        d="M12 22L4 18V9L8 4L17 7L20 14L12 22Z"
        stroke={styles.strokeColor ?? "black"}
        strokeOpacity={styles.strokeOpacity}
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <Circle cx="8" cy="4" />
      <Circle cx="4" cy="18" />
      <Circle cx="12" cy="22" />
      <Circle cx="20" cy="14" />
      <Circle cx="17" cy="7" />
      <Circle cx="4" cy="9" />
    </svg>
  );
};

export const CircleIcon = ({ styles, size, ...rest }: PathIconProps) => {
  return (
    <svg
      {...getSizeProps(size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill={styles.fillColor}
        fillOpacity={styles.fillOpacity}
        stroke={styles.strokeColor ?? "black"}
        strokeOpacity={styles.strokeOpacity}
        strokeWidth="2"
      />
      <Circle cx="12" cy="4" />
      <Circle cx="20" cy="12" />
      <Circle cx="12" cy="20" />
      <Circle cx="4" cy="12" />
    </svg>
  );
};

export const RectangleIcon = ({ styles, size, ...rest }: PathIconProps) => {
  return (
    <svg
      {...getSizeProps(size)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={styles.fillColor}
      fillOpacity={styles.fillOpacity}
      {...rest}
    >
      <path
        d="M22 4V20H2V4H22Z"
        stroke={styles.strokeColor ?? "black"}
        strokeOpacity={styles.strokeOpacity}
      />
      <Circle cx="2" cy="20" />
      <Circle cx="2" cy="4" />
      <Circle cx="22" cy="4" />
      <Circle cx="22" cy="20" />
    </svg>
  );
};
