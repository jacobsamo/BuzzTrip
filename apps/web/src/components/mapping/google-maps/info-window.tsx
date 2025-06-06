import { cn } from "@/lib/utils";
import { CombinedMarker } from "@buzztrip/backend/types";
import { InfoWindow, InfoWindowProps } from "@vis.gl/react-google-maps";
import Image from "next/image";

interface InfoBoxProps extends InfoWindowProps {
  activeLocation: CombinedMarker;
}

/**
 * An info box that displays a markers information
 */
const InfoBox = ({ activeLocation, ...props }: InfoBoxProps) => {
  const handleClose = () => {};

  const Header = () => {
    return (
      <h1 className="w-fit text-wrap text-start text-xl font-bold">
        {activeLocation.title}
      </h1>
    );
  };

  return (
    <InfoWindow
      onClose={handleClose}
      className={cn("h-44 w-44 rounded-md z-10", props.className)}
      {...props}
    >
      <div className="h-44 w-44 flex-row gap-2 overflow-x-auto overflow-y-hidden rounded-t-md">
        {activeLocation.photos &&
          activeLocation.photos.map((photo) => (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <Image
              key={photo}
              src={photo}
              width={64}
              height={64}
              alt="location photo"
              className="aspect-square h-16 w-16 rounded-md object-cover object-center"
            />
          ))}
      </div>
    </InfoWindow>
  );
};

export default InfoBox;
