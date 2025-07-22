"use client";

import MarkerPin from "@/components/mapping/google-maps-old/marker_pin";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { getMarkersForCollection } from "@/lib/utils";
import { Id } from "@buzztrip/backend/dataModel";
import {
  Collection,
  CollectionLink,
  CombinedMarker,
  IconType,
  NewCollection,
} from "@buzztrip/backend/types";
import {
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  TreeState,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { useMap } from "@vis.gl/react-google-maps";
import { FolderIcon, FolderOpenIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

// Add type guard function
function isCombinedMarker(payload: any): payload is CombinedMarker {
  return payload && "_id" in payload && "title" in payload && "icon" in payload;
}

interface Item {
  name: string;
  children?: string[];
  isFolder?: boolean;
  icon: IconType;
  color?: string;
  payload?: NewCollection | CombinedMarker;
}

const generateTree = (
  markers: CombinedMarker[] | null,
  collections: Collection[] | null,
  collectionLinks: CollectionLink[] | null
): Record<string, Item> => {
  // Handle null cases by providing empty arrays
  const safeMarkers = markers ?? [];
  const safeCollections = collections ?? [];
  const safeCollectionLinks = collectionLinks ?? [];

  // Create root item
  const rootItem: Item = {
    name: "Collections",
    children: safeCollections.map((collection) => collection._id),
    icon: "Folder" as IconType,
  };

  const collectionsMap = safeCollections.reduce(
    (acc, collection) => {
      const markersForCollection = getMarkersForCollection(
        safeMarkers.map((marker) => ({
          ...marker,
          _id: marker._id as Id<"markers">,
        })),
        safeCollectionLinks,
        collection._id
      );
      const collectionItem: Item = {
        name: collection.title,
        children: markersForCollection.map((marker) => marker._id),
        isFolder: true,
        icon: collection.icon as IconType,
        payload: collection,
      };
      acc[collection._id] = collectionItem;
      return acc;
    },
    {} as Record<string, Item>
  );

  const markersMap = safeMarkers.reduce(
    (acc, marker) => {
      const markerItem: Item = {
        name: marker.title,
        icon: marker.icon as IconType,
        color: marker.color,
        payload: marker,
      };
      acc[marker._id as Id<"markers">] = markerItem;
      return acc;
    },
    {} as Record<string, Item>
  );

  return { root: rootItem, ...collectionsMap, ...markersMap };
};

const indent = 20;

export default function CollectionTree() {
  const {
    markers,
    collections,
    collectionLinks,
    setActiveState,
    setActiveLocation,
  } = useMapStore((state) => state);
  const map = useMap();

  const [treeState, setTreeState] = useState<Partial<TreeState<Item>>>({
    expandedItems: collections?.map((collection) => collection._id) ?? [],
  });
  const [items, setItems] = useState<Record<string, Item>>();

  const tree = useTree<Item>({
    state: treeState,
    setState: setTreeState,
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => item.getItemData().isFolder ?? false,
    dataLoader: {
      getItem: (itemId) =>
        (items ?? {})[itemId] ??
        Promise.reject(new Error(`Item ${itemId} not found`)),
      getChildren: (itemId) => (items ?? {})[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  useEffect(() => {
    setItems(generateTree(markers, collections, collectionLinks));
    setTreeState({
      expandedItems: collections?.map((collection) => collection._id) ?? [],
    });
  }, [markers, collections, collectionLinks]);

  return (
    <Tree
      className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
      indent={indent}
      tree={tree}
    >
      {tree.getItems().map((item, index) => {
        return (
          <TreeItem key={`${item.getId()}-${index}`} item={item}>
            <TreeItemLabel
              className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10"
              onClick={() => {
                const payload = item.getItemData().payload;
                if (isCombinedMarker(payload)) {
                  if (map) {
                    map.panTo({ lat: payload.lat, lng: payload.lng });
                    map.moveCamera({ zoom: 15 });
                    setActiveLocation(payload);
                  }
                }
              }}
            >
              <>
                {item.isFolder() ? (
                  <span className="-order-1 flex flex-1 items-center gap-2">
                    {item.isExpanded() ? (
                      <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                    ) : (
                      <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                    )}
                    {item.getItemName()}
                  </span>
                ) : (
                  <>
                    <MarkerPin
                      color={item.getItemData().color}
                      icon={item.getItemData().icon ?? "MapPin"}
                      size={16}
                    />
                    <span className="wrap ml-2 text-center text-sm">
                      {item.getItemName()}
                    </span>
                    <div
                      className="text-sidebar-foreground ring-sidebar-ring hover:bg-accent hover:text-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-4 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        const payload = item.getItemData().payload;
                        if (isCombinedMarker(payload)) {
                          setActiveState({ event: "markers:update", payload });
                        }
                      }}
                    >
                      <Pencil />
                    </div>
                  </>
                )}
              </>
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </Tree>
  );
}
