import { IconName, type IconProps } from "@/components/icon";
import { CombinedMarker, Marker } from "@/types";
import { lazy } from "react";

const Icon = lazy(() => import("@/components/icon"));

interface MarkerPinProps extends Omit<IconProps, "name"> {
  backgroundColor?: string;
  marker?: CombinedMarker | null;
  name?: string;
}

const MarkerPin = ({
  backgroundColor = "#E65200",
  name = "MdOutlineLocationOn",
  marker = null,
  size,
}: MarkerPinProps) => {
  return (
    <div
      className="h-fit w-fit rounded-full p-1"
      style={{ backgroundColor: marker?.color ?? backgroundColor }}
    >
      <Icon
        name={(marker?.icon as IconName) ?? name}
        color="#fff"
        size={size}
      />
    </div>
  );
};

export default MarkerPin;
