import React, { Suspense } from "react";
import {
  Icons,
  popular,
} from "./icons";
import type {
  IconType,
  PopularIcon,
} from "@buzztrip/backend/types";

export interface IconProps {
  name: IconType;
  color?: React.CSSProperties["color"] | string;
  size?: number;
}

const LazyIcon = ({ name }: { name: string }) =>
  React.lazy(() =>
    import("@phosphor-icons/react").then((mod) => ({ default: mod[name as keyof typeof mod] }))
  );

// export const Icon = ({
//   name = "MapPin",
//   color = "#000",
//   size = 24,
//   ...props
// }: IconProps) => {
//   const DynamicIcon = LazyIcon({ name });

//   return (
//     <Suspense fallback={<div style={{ width: size, height: size }} />}>
//       <DynamicIcon color={color} size={size} weight="regular" {...props} />
//     </Suspense>
//   );
// };

const Icon = ({
  name = "MapPin",
  color = "#000",
  size = 24,
  ...props
}: IconProps) => {
  const DisplayIcon = Icons[name];

  return <DisplayIcon color={color} size={size} weight="regular" {...props} />;
};

export default Icon;

export * from './icons'

export const iconsList = Object.keys(Icons) as IconType[];
export const popularIconsList = Object.keys(popular) as PopularIcon[];
