import { Path } from "@buzztrip/backend/types";
import { Feature, Point, Polygon, LineString } from "geojson";


// implment what terra draw does for `addFeature`
type JSON = string | number | boolean | null | JSONArray | JSONObject;
export interface JSONObject {
    [member: string]: JSON;
}
type JSONArray = Array<JSON>;
type DefinedProperties = Record<string, JSON>;
export type GeoJSONStoreGeometries = Polygon | LineString | Point;
export type BBoxPolygon = Feature<Polygon, DefinedProperties>;
export type GeoJSONStoreFeatures = Feature<GeoJSONStoreGeometries, DefinedProperties>;

export const pathsToGeoJson = (paths: Path[]): GeoJSONStoreFeatures[] => {
    // TODO: implement logic to transform a path schema to GeoJSON
    return [];
}

export const geoJsonToPaths = (features: GeoJSONStoreFeatures[]): Path[] => {
    // TODO: implement logic to transform GeoJSON to a path schema
    return []
}