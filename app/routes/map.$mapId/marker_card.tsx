import { Marker } from "@/lib/types";
// import EditMarker from "./EditMarker";
import MarkerPin from "./MarkerPin";
import MarkerModal from "./modals/create_edit_marker_modal";

const MarkerCard = ({ marker }: { marker: Marker }) => {
  return (
    <div className="flex flex-row justify-between">
      <MarkerPin
        name="MdLocationOn"
        // backgroundColor={marker.color || "#E65200"}
      />
      <h1>{marker.title}</h1>

      <MarkerModal mode="edit" marker={marker} />
    </div>
  );
};

export default MarkerCard;
