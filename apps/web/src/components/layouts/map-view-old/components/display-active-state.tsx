"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveLocation from "./active_location";
import DisplayCollection from "./display-collection";
import DisplayMarker from "./display-marker";

const DisplayActiveState = () => {
  const { activeLocation, collections, markers, getMarkersForCollection } =
    useMapStore((state) => state);

  return (
    <div className="flex-1 overflow-y-auto">
      {!activeLocation && (
        <Tabs defaultValue="collections">
          <TabsList className="mx-auto w-11/12 justify-evenly">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="markers">Markers</TabsTrigger>
          </TabsList>
          <TabsContent value="collections" className="p-1 list-none">
            <ScrollArea>
              {collections ? (
                collections?.map((collection) => {
                  const mark = getMarkersForCollection(collection._id);
                  return (
                    <DisplayCollection
                      key={collection._id}
                      collection={collection}
                      markers={mark}
                    />
                  );
                })
              ) : (
                <p>No Collections</p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="markers" className="p-1">
            <ScrollArea>
              {markers ? (
                markers.map((marker) => (
                  <DisplayMarker marker={marker} key={marker._id} />
                ))
              ) : (
                <p>No Markers</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      {activeLocation && (
        <ActiveLocation />
      )}
    </div>
  );
};

export default DisplayActiveState;
