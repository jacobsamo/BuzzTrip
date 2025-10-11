import type { Id } from "@buzztrip/backend/dataModel"
import { UserDetailContent } from "./user-detail-content"

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const userId = id as Id<"users">

  return <UserDetailContent userId={userId} />
}
