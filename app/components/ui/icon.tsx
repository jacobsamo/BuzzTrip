import { IconBaseProps, IconType } from "react-icons";
import * as MDI from "react-icons/md";

export interface IconProps extends IconBaseProps {
  name: keyof typeof MDI;
  color?: React.CSSProperties["color"] | string;
  size?: number;
}

const Icon = ({
  name = "MdLocationOn",
  color = "#000",
  size = 24,
  ...props
}: IconProps) => {
  const DisplayIcon = MDI[name] as IconType;

  return <DisplayIcon color={color} size={size} {...props} />;
};

export default Icon;
