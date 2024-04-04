import { Marker } from "@/lib/types";
// import EditMarker from "./EditMarker";
import MarkerPin from "./MarkerPin";
import MarkerModal from "./modals/create_edit_marker_modal";
import { useMapContext } from "./providers/map_provider";

const MarkerCard = ({ marker }: { marker: Marker }) => {
  const {setActiveLocation} = useMapContext();
  return (
    <button className="flex flex-row justify-between" onClick={() => setActiveLocation(marker)}>
      <MarkerPin
        name="MdLocationOn"
        // backgroundColor={marker.color || "#E65200"}
      />
      <h1>{marker.title}</h1>

      <MarkerModal mode="edit" marker={marker} />
    </button>
  );
};

export default MarkerCard;
