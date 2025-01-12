import type { IconProps } from "@buzztrip/components/icon";
import type { IconType } from "@buzztrip/db/types";
import { CombinedMarker } from "@buzztrip/db/types";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import("@buzztrip/components/icon"), { ssr: false });

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
        name={(marker?.icon as IconType) ?? name}
        color="#fff"
        size={size}
      />
    </div>
  );
};

export default MarkerPin;
