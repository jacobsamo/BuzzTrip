import type { Id } from "@buzztrip/backend/dataModel"
import { MapDetailContent } from "./map-detail-content"

interface MapDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MapDetailPage({ params }: MapDetailPageProps) {
  const { id } = await params
  const mapId = id as Id<"maps">

  return <MapDetailContent mapId={mapId} />
}
