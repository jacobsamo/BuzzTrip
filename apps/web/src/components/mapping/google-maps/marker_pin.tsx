import type { IconType } from "@buzztrip/backend/types";
import type { IconProps } from "@buzztrip/components/icon";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import("@buzztrip/components/icon"), { ssr: false });

interface MarkerPinProps extends Omit<IconProps, "name" | "color"> {
  backgroundColor?: string;
  icon?: IconType;
  color?: string | null;
}

const MarkerPin = ({
  backgroundColor = "#E65200",
  icon = "MapPin",
  color = null,
  size,
  ...props
}: MarkerPinProps) => {
  return (
    <div
      className="h-fit w-fit rounded-full p-1"
      style={{ backgroundColor: color ?? backgroundColor }}
    >
      <Icon name={icon} color="#fff" size={size} {...props} />
    </div>
  );
};

export default MarkerPin;
