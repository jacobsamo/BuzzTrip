import { Marker } from "@/lib/types";
import { Edit } from "lucide-react";
import { IconProps } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
// import EditMarker from "./EditMarker";
import MarkerPin from "./MarkerPin";

const MarkerCard = ({ marker }: { marker: Marker }) => {
  return (
    <div className="flex flex-row justify-between">
      <MarkerPin
        name="MdLocationOn"
        // backgroundColor={marker.color || "#E65200"}
      />
      <h1>{marker.title}</h1>

      {/* <EditMarker
        marker={marker}
        Trigger={
          <Button aria-label="Add to collection" variant="ghost">
            <Edit />
          </Button>
        }
      /> */}
    </div>
  );
};

export default MarkerCard;
