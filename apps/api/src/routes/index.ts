// Maps
import { createMapRoute } from "./map/create-map-route";
import { editMapRoute } from "./map/edit-map-route";
import { getMapDataRoute } from "./map/get-map-data-route";
import { getMapRoute } from "./map/get-map-route";
import { shareMapRoute } from "./map/share-map-route";
// Collections
import { createCollectionRoute } from "./map/collection/create-collection-route";
import { editCollectionRoute } from "./map/collection/edit-collection-route";
// Markers
import { createMarkerRoute } from "./map/marker/create-marker-route";
import { editMarkerRoute } from "./map/marker/edit-marker-route";
//Uploads
import { uploadFileRoute } from "./upload/upload-file-route";
// Users
import { getUserMapsRoute } from "./user/get-user-maps-route";
import { searchUserRoute } from "./user/search-user-route";
import { updateUserRoute } from "./user/update-user-route";

export const routes = [
  // User routes
  getUserMapsRoute,
  searchUserRoute,
  updateUserRoute,
  // Upload routes
  uploadFileRoute,
  // Map routes
  createMapRoute,
  editMapRoute,
  getMapDataRoute,
  getMapRoute,
  shareMapRoute,
  // Marker Routes
  createMarkerRoute,
  editMarkerRoute,
  // Collection routes
  createCollectionRoute,
  editCollectionRoute,
] as const;

export type AppType = (typeof routes)[number];
