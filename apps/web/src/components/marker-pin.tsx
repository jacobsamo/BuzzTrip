import type { IconType } from "@buzztrip/backend/types";
import type { IconProps } from "@buzztrip/components/icon";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import("@buzztrip/components/icon"), { ssr: false });

interface MarkerPinProps extends Omit<IconProps, "name" | "color"> {
  backgroundColor?: string;
  icon?: IconType;
  color?: string | null;
  showIcon?: boolean;
}

const MarkerPin = ({
  backgroundColor = "#E65200",
  icon = "MapPin",
  color = null,
  size,
  showIcon = true,
  ...props
}: MarkerPinProps) => {
  return (
    <div
      className="group size-fit rounded-full p-1 border border-white transition duration-300 ease-in-out transform hover:scale-110"
      style={{ backgroundColor: color ?? backgroundColor }}
    >
      {showIcon && <Icon name={icon} color="#fff" size={size} {...props} />}
    </div>
  );
};

export default MarkerPin;
