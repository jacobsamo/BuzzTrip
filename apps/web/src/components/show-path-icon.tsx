import { Path, PathStyle } from "@buzztrip/backend/types";
import {
  CircleIcon,
  LineIcon,
  PathIconProps,
  PolygonIcon,
  RectangleIcon,
} from "./icons/paths";

interface ShowPathIconProps extends Omit<PathIconProps, "styles"> {
  pathType: Path["pathType"];
  styles?: Partial<PathStyle>; // allow partial override
}

export const fallbackStyle = {
  strokeColor: "#000000",
  strokeOpacity: 1,
  strokeWidth: 2,
  fillColor: "#FFFFFF",
  fillOpacity: 0.5,
};

export const ShowPathIcon = ({
  pathType,
  styles = {},
  ...rest
}: ShowPathIconProps) => {
  const mergedStyles: PathStyle = {
    ...fallbackStyle,
    ...styles,
  };

  const sharedProps: PathIconProps = {
    styles: mergedStyles,
    ...rest,
  };

  switch (pathType) {
    case "circle":
      return <CircleIcon {...sharedProps} />;
    case "rectangle":
      return <RectangleIcon {...sharedProps} />;
    case "polygon":
      return <PolygonIcon {...sharedProps} />;
    case "line":
      return <LineIcon {...sharedProps} />;
    default:
      return <PolygonIcon {...sharedProps} />;
  }
};
