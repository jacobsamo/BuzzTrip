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
          map_id: string
          title: string
          uid: string
        }
        Insert: {
          color: string
          description: string
          icon: string
          map_id: string
          title: string
          uid?: string
        }
        Update: {
          color?: string
          description?: string
          icon?: string
          map_id?: string
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["uid"]
          },
        ]
      }
      map: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          image: string | null
          title: string
          uid: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          image?: string | null
          title: string
          uid?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          image?: string | null
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marker: {
        Row: {
          collection_id: string
          created_at: string
          created_by: string
          description: string
          lat: number
          lng: number
          title: string
          uid: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          created_by: string
          description: string
          lat: number
          lng: number
          title: string
          uid?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          created_by?: string
          description?: string
          lat?: number
          lng?: number
          title?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "marker_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "marker_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_map: {
        Row: {
          map_id: string
          permission: Database["public"]["Enums"]["permission_level"]
          user_id: string
        }
        Insert: {
          map_id: string
          permission: Database["public"]["Enums"]["permission_level"]
          user_id: string
        }
        Update: {
          map_id?: string
          permission?: Database["public"]["Enums"]["permission_level"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_map_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "shared_map_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
      permission_level: "viewer" | "editer" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
