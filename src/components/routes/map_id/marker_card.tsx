import { Location, Marker } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";
import MarkerPin from "./marker_pin";
import MarkerModal from "./modals/create_edit_marker_modal";
import { useMapContext } from "./providers/map_provider";

const MarkerCard = ({ marker }: { marker: Marker }) => {
  const { setActiveLocation } = useMapContext();
  const map = useMap();

  return (
    <div className="flex flex-row justify-between">
      <button
        onClick={() => {
          if (map) map!.panTo({ lat: marker.lat, lng: marker.lng });
          setActiveLocation(marker as Location);
        }}
        className="inline-flex items-center gap-2"
      >
        <MarkerPin marker={marker} />
        <h1>{marker.title}</h1>
      </button>

      <MarkerModal mode="edit" marker={marker} />
    </div>
  );
};

export default MarkerCard;
