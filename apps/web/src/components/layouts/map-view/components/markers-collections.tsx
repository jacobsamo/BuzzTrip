import { useMapStore } from "@/components/providers/map-state-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@buzztrip/ui/components/tabs";
import { ScrollArea } from "@buzztrip/ui/components/scroll-area";
import { useEffect, useState } from "react";
import DisplayMarker from "./display-marker";
import CollectionTree from "./tree-view";
import DisplayPath from "./display-path";
import DisplayTravelBoundary from "./display-travel-boundary";

const MarkersCollectionTabs = () => {
  const { markers, collections, paths, travelBoundaries } = useMapStore((state) => state);
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
          <TabsTrigger value="boundaries">Boundaries</TabsTrigger>
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
            {paths &&
              paths.map((path) => <DisplayPath path={path} key={path._id} />)}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="boundaries">
          <ScrollArea className="h-full">
            {travelBoundaries && travelBoundaries.length > 0 ? (
              travelBoundaries.map((boundary) => (
                <DisplayTravelBoundary boundary={boundary} key={boundary._id} />
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No travel boundaries yet. Click the timer icon to create one.
              </p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkersCollectionTabs;
