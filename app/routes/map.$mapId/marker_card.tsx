import { Marker } from "@/lib/types";
// import EditMarker from "./EditMarker";
import MarkerPin from "./MarkerPin";
import MarkerModal from "./modals/create_edit_marker_modal";
import { useMapContext } from "./providers/map_provider";
import { useMap } from "@vis.gl/react-google-maps";

const MarkerCard = ({ marker }: { marker: Marker }) => {
  const { setActiveLocation } = useMapContext();
  const map = useMap();

  return (
    <div className="flex flex-row justify-between">
      <button
        onClick={() => {
          map!.panTo({ lat: marker.lat, lng: marker.lng });
          setActiveLocation(marker);
        }}
        className="inline-flex gap-2 items-center"
      >
        <MarkerPin
          name="MdLocationOn"
          // backgroundColor={marker.color || "#E65200"}
        />
        <h1>{marker.title}</h1>
      </button>

      <MarkerModal mode="edit" marker={marker} />
    </div>
  );
};

export default MarkerCard;
