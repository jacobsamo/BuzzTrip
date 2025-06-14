import { PermissionEnum } from "../types";

// Core permission building blocks
type CrudAction = "create" | "update" | "delete";
const entityTypes = [
  "maps",
  "map_users",
  "labels",
  "markers",
  "collections",
  "collection_links",
  "routes",
  "route_stops",
] as const;

type EntityType = (typeof entityTypes)[number];
export type EntityPermission = `${EntityType}:${CrudAction}`;

// Helper to generate full permission strings
export const createAction = (
  entity: EntityType,
  actions: CrudAction[]
): EntityPermission[] =>
  actions.map((action) => `${entity}:${action}` as EntityPermission);

// Editor permission set
const editorEntityPermissions: EntityPermission[] = [
  ...createAction("maps", ["update"]),
  ...createAction("map_users", ["create", "update"]),
  ...createAction("labels", ["create", "update", "delete"]),
  ...createAction("markers", ["create", "update", "delete"]),
  ...createAction("collections", ["create", "update", "delete"]),
  ...createAction("collection_links", ["create", "update", "delete"]),
  ...createAction("routes", ["create", "update", "delete"]),
  ...createAction("route_stops", ["create", "update", "delete"]),
];

// Permissions assigned to each role
export const rolePermissions: Record<PermissionEnum, EntityPermission[]> = {
  commenter: [],
  viewer: [],
  editor: editorEntityPermissions,
  owner: [
    ...editorEntityPermissions, // inherits everything from editor
    ...createAction("maps", ["delete"]),
    ...createAction("map_users", ["delete"]),
  ],
};

// Check if the user's role includes permission for an action
export const canPerformAction = (
  role: PermissionEnum,
  permission: EntityPermission
): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};
