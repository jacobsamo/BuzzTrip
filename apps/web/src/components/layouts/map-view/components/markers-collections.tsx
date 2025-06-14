import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import DisplayMarker from "./display-marker";
import CollectionTree from "./tree-view";

const MarkersCollectionTabs = () => {
  const { markers, collections } = useMapStore((state) => state);
  const [defaultTab, setDefaultTab] = useState("collections");

  useEffect(() => {
    if (!markers || !collections) return;

    if (!collections && markers) setDefaultTab("markers");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <Tabs defaultValue={defaultTab}>
        <TabsList className="mx-auto w-11/12 justify-evenly">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="markers">Markers</TabsTrigger>
        </TabsList>
        <TabsContent value="collections">
          <ScrollArea>
            {collections ? (
              <ScrollArea className="h-full">
                <CollectionTree />
              </ScrollArea>
            ) : (
              <p>No Collections</p>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="markers">
          <ScrollArea className="h-full">
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
    </div>
  );
};

export default MarkersCollectionTabs;
