import { type IconProps } from "@/components/ui/icon";
import { Marker } from "@/types";
import { lazy } from "react";

const Icon = lazy(() => import("@/components/ui/icon"));

interface MarkerPinProps extends Omit<IconProps, "name"> {
  backgroundColor?: string;
  marker?: Marker | null;
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
        name={(marker?.icon as IconProps["name"]) ?? name}
        color="#fff"
        size={size}
      />
    </div>
  );
};

export default MarkerPin;
