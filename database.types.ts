export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collection: {
        Row: {
          color: string
          description: string
          icon: string
          mapId: string
          title: string
          uid: string
        }
        Insert: {
          color: string
          description: string
          icon: string
          mapId: string
          title: string
          uid: string
        }
        Update: {
          color?: string
          description?: string
          icon?: string
          mapId?: string
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_mapId_map_uid_fk"
            columns: ["mapId"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["uid"]
          }
        ]
      }
      map: {
        Row: {
          createdAt: string
          createdBy: string
          description: string
          image: string | null
          title: string
          uid: string
        }
        Insert: {
          createdAt?: string
          createdBy: string
          description: string
          image?: string | null
          title: string
          uid: string
        }
        Update: {
          createdAt?: string
          createdBy?: string
          description?: string
          image?: string | null
          title?: string
          uid?: string
        }
        Relationships: []
      }
      marker: {
        Row: {
          address: string
          collectionId: string
          color: string
          icon: string
          lat: number
          lng: number
          mapId: string
          title: string
          uid: string
        }
        Insert: {
          address: string
          collectionId: string
          color: string
          icon: string
          lat: number
          lng: number
          mapId: string
          title: string
          uid: string
        }
        Update: {
          address?: string
          collectionId?: string
          color?: string
          icon?: string
          lat?: number
          lng?: number
          mapId?: string
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "marker_collectionId_collection_uid_fk"
            columns: ["collectionId"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "marker_mapId_map_uid_fk"
            columns: ["mapId"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["uid"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
