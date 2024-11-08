import {
  getAllMapData,
  getCollectionMarkersForMap,
  getCollectionsForMap,
  getMap,
  getMapUsers,
  getMarkersView,
  getUserMaps,
} from "../queries";

// TODO: add caching for repetitive queries that won't change often
// okay for now as we have a small number of queries
// will need to use something other than next/cache as we are hitting a hono endpoint
// use something like redis to cache the queries