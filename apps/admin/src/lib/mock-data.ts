function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// In-memory cache for consistent data
let cachedUsers: User[] | null = null
let cachedMaps: Map[] | null = null

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  lastLogin: string
  mapsCount: number
  markersCount: number
  collectionsCount: number
}

export interface Map {
  id: string
  title: string
  description?: string
  ownerId: string
  ownerName: string
  createdAt: string
  updatedAt: string
  visibility: "public" | "private" | "unlisted"
  markersCount: number
  collectionsCount: number
  routesCount: number
  pathsCount: number
  collaboratorsCount: number
}

export interface Marker {
  id: string
  title: string
  lat: number
  lng: number
  createdAt: string
  createdBy: string
  mapId: string
}

export interface Collection {
  id: string
  title: string
  description?: string
  createdAt: string
  createdBy: string
  mapId: string
  markersCount: number
}

export interface Collaborator {
  id: string
  userId: string
  userName: string
  userEmail: string
  permission: "viewer" | "editor" | "admin"
  addedAt: string
}

export interface LoginSession {
  id: string
  userId: string
  loginAt: string
  ipAddress: string
  userAgent: string
}

// Generate mock users
export function generateMockUsers(count = 50): User[] {
  if (cachedUsers) {
    return cachedUsers
  }

  const users: User[] = []
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams",
    "David Brown",
    "Emma Davis",
    "Frank Miller",
    "Grace Wilson",
    "Henry Moore",
    "Ivy Taylor",
    "Jack Anderson",
  ]

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] as string
    const email = `${name.toLowerCase().replace(" ", ".")}${i}@example.com`
    const createdAt = new Date(Date.now() - seededRandom(i * 100) * 365 * 24 * 60 * 60 * 1000).toISOString()
    const lastLogin = new Date(Date.now() - seededRandom(i * 101) * 30 * 24 * 60 * 60 * 1000).toISOString()

    users.push({
      id: `user_${i + 1}`,
      name: `${name} ${i + 1}`,
      email,
      createdAt,
      lastLogin,
      mapsCount: Math.floor(seededRandom(i * 102) * 20) + 1,
      markersCount: Math.floor(seededRandom(i * 103) * 100) + 5,
      collectionsCount: Math.floor(seededRandom(i * 104) * 15) + 1,
    })
  }

  cachedUsers = users
  return users
}

// Generate mock maps
export function generateMockMaps(count = 100): Map[] {
  if (cachedMaps) {
    return cachedMaps
  }

  const maps: Map[] = []
  const titles = [
    "Travel Plans",
    "Favorite Restaurants",
    "Hiking Trails",
    "City Guide",
    "Road Trip",
    "Beach Spots",
    "Coffee Shops",
    "Historical Sites",
    "Photography Locations",
    "Running Routes",
  ]
  const visibilities: ("public" | "private" | "unlisted")[] = ["public", "private", "unlisted"]

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - seededRandom(i * 200) * 365 * 24 * 60 * 60 * 1000).toISOString()
    const updatedAt = new Date(
      new Date(createdAt).getTime() + seededRandom(i * 201) * 30 * 24 * 60 * 60 * 1000,
    ).toISOString()

    maps.push({
      id: `map_${i + 1}`,
      title: `${titles[i % titles.length]} ${i + 1}`,
      description: seededRandom(i * 202) > 0.5 ? "A collection of interesting places" : undefined,
      ownerId: `user_${Math.floor(seededRandom(i * 203) * 50) + 1}`,
      ownerName: `User ${Math.floor(seededRandom(i * 203) * 50) + 1}`,
      createdAt,
      updatedAt,
      visibility: visibilities[Math.floor(seededRandom(i * 204) * visibilities.length)] as "public" | "private" | "unlisted",
      markersCount: Math.floor(seededRandom(i * 205) * 50) + 1,
      collectionsCount: Math.floor(seededRandom(i * 206) * 10),
      routesCount: Math.floor(seededRandom(i * 207) * 5),
      pathsCount: Math.floor(seededRandom(i * 208) * 8),
      collaboratorsCount: Math.floor(seededRandom(i * 209) * 5),
    })
  }

  cachedMaps = maps
  return maps
}

// Generate mock markers for a map
export function generateMockMarkers(mapId: string, count = 20): Marker[] {
  const markers: Marker[] = []
  const titles = [
    "Coffee Shop",
    "Restaurant",
    "Park",
    "Museum",
    "Beach",
    "Trail Head",
    "Viewpoint",
    "Hotel",
    "Store",
    "Landmark",
  ]

  const seed = Number.parseInt(mapId.split("_")[1] || "1") * 1000

  for (let i = 0; i < count; i++) {
    markers.push({
      id: `marker_${mapId}_${i + 1}`,
      title: `${titles[i % titles.length]} ${i + 1}`,
      lat: 37.7749 + (seededRandom(seed + i) - 0.5) * 0.1,
      lng: -122.4194 + (seededRandom(seed + i + 1000) - 0.5) * 0.1,
      createdAt: new Date(Date.now() - seededRandom(seed + i + 2000) * 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: `user_${Math.floor(seededRandom(seed + i + 3000) * 10) + 1}`,
      mapId,
    })
  }

  return markers
}

// Generate mock collections for a map
export function generateMockCollections(mapId: string, count = 5): Collection[] {
  const collections: Collection[] = []
  const titles = ["Favorites", "To Visit", "Visited", "Recommended", "Hidden Gems"]

  const seed = Number.parseInt(mapId.split("_")[1] || "1") * 2000

  for (let i = 0; i < count; i++) {
    collections.push({
      id: `collection_${mapId}_${i + 1}`,
      title: titles[i % titles.length] as string,
      description: seededRandom(seed + i) > 0.5 ? "A curated collection" : undefined,
      createdAt: new Date(Date.now() - seededRandom(seed + i + 1000) * 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: `user_${Math.floor(seededRandom(seed + i + 2000) * 10) + 1}`,
      mapId,
      markersCount: Math.floor(seededRandom(seed + i + 3000) * 15) + 1,
    })
  }

  return collections
}

// Generate mock collaborators for a map
export function generateMockCollaborators(mapId: string, count = 3): Collaborator[] {
  const collaborators: Collaborator[] = []
  const permissions: ("viewer" | "editor" | "admin")[] = ["viewer", "editor", "admin"]

  const seed = Number.parseInt(mapId.split("_")[1] || "1") * 3000

  for (let i = 0; i < count; i++) {
    const userNum = Math.floor(seededRandom(seed + i) * 50) + 1
    const userId = `user_${userNum}`
    collaborators.push({
      id: `collab_${mapId}_${i + 1}`,
      userId,
      userName: `User ${userNum}`,
      userEmail: `user${userNum}@example.com`,
      permission: permissions[Math.floor(seededRandom(seed + i + 1000) * permissions.length)] as "viewer" | "editor" | "admin",
      addedAt: new Date(Date.now() - seededRandom(seed + i + 2000) * 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return collaborators
}

// Generate mock login sessions for a user
export function generateMockLoginSessions(userId: string, count = 10): LoginSession[] {
  const sessions: LoginSession[] = []
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148",
  ]

  const seed = Number.parseInt(userId.split("_")[1] || "1") * 4000

  for (let i = 0; i < count; i++) {
    sessions.push({
      id: `session_${userId}_${i + 1}`,
      userId,
      loginAt: new Date(Date.now() - seededRandom(seed + i) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `${Math.floor(seededRandom(seed + i + 1000) * 255)}.${Math.floor(seededRandom(seed + i + 1001) * 255)}.${Math.floor(seededRandom(seed + i + 1002) * 255)}.${Math.floor(seededRandom(seed + i + 1003) * 255)}`,
      userAgent: userAgents[Math.floor(seededRandom(seed + i + 2000) * userAgents.length)] as string,
    })
  }

  return sessions.sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime())
}

// Generate time series data for charts
export function generateTimeSeriesData(days = 30) {
  const data = []
  const now = Date.now()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    data.push({
      date: date.toISOString().split("T")[0],
      markers: Math.floor(seededRandom(i * 500) * 20) + 5,
      collections: Math.floor(seededRandom(i * 501) * 5) + 1,
      routes: Math.floor(seededRandom(i * 502) * 3),
      paths: Math.floor(seededRandom(i * 503) * 4),
    })
  }

  return data
}
