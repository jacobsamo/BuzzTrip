import Icon, { IconProps } from "@/components/ui/icon";
import { Collection, Marker } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import {
    ChevronDownIcon
} from "lucide-react";
import MarkerCard from "./marker_card";
import CollectionModal from "./modals/create_edit_collection_modal";

export interface CollectionCardProps {
  collection: Collection;
  markers: Marker[] | null;
}

/**
 * Renders a collection of markers
 * @param collection Collection
 * @param markers Marker[] - the markers to render for that collection
 */
const CollectionCard = ({ collection, markers }: CollectionCardProps) => {
  return (
    <Accordion.Item value={collection.uid}>
      <Accordion.Trigger className="group relative flex flex-row items-center gap-2 w-full">
        <Icon
          name={collection.icon as IconProps["name"]}
          size={24}
          color="#000"
        />
        <h1>{collection.title}</h1>
        <CollectionModal
          mode="edit"
          collection={collection}
          map_id={collection.map_id}
        />
        <ChevronDownIcon
          className="absolute right-2 text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
      <Accordion.Content>
        <ul key={`markers-${collection.uid}`} className="ml-4">
          {markers &&
            markers.map((marker) => (
              <li key={marker.uid}>
                <MarkerCard marker={marker} />
              </li>
            ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default CollectionCard;
