import Icon, { type IconProps } from "@/components/ui/icon";

interface MarkerPinProps extends IconProps {
  backgroundColor?: string;
}

const MarkerPin = ({
  backgroundColor = "#E65200",
  name = "MdOutlineLocationOn",
  size,
}: MarkerPinProps) => {
  return (
    <div
      className="h-fit w-fit rounded-full p-1"
      style={{ backgroundColor: backgroundColor }}
    >
      <Icon name={name} color="#fff" size={size} />
    </div>
  );
};

export default MarkerPin;
