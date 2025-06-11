import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import DisplayMarker from "../../map-view-old/components/display-marker";
import CollectionTree from "./tree-view";

const MarkersCollectionTabs = () => {
  const { markers, collections } = useMapStore((state) => state);
  const [defaultTab, setDefaultTab] = useState("collections");

//   useEffect(() => {
//     if (!markers || !collections) return;

//     if (!collections && markers) setDefaultTab("markers");
//   }, []);

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="mx-auto w-11/12 justify-evenly">
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="markers">Markers</TabsTrigger>
      </TabsList>
      <TabsContent value="collections" className="p-1 list-none">
        <ScrollArea>
          {collections ? <CollectionTree /> : <p>No Collections</p>}
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
  );
};

export default MarkersCollectionTabs;
