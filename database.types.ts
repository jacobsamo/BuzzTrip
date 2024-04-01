export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      collection: {
        Row: {
          color: string | null;
          description: string | null;
          icon: string | null;
          map_id: string;
          title: string;
          uid: string;
        };
        Insert: {
          color?: string | null;
          description?: string | null;
          icon?: string | null;
          map_id: string;
          title: string;
          uid?: string;
        };
        Update: {
          color?: string | null;
          description?: string | null;
          icon?: string | null;
          map_id?: string;
          title?: string;
          uid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "map";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "collection_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "shared_map_view";
            referencedColumns: ["uid"];
          },
        ];
      };
      map: {
        Row: {
          created_at: string;
          created_by: string;
          description: string | null;
          image: string | null;
          title: string;
          uid: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          description?: string | null;
          image?: string | null;
          title: string;
          uid?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          description?: string | null;
          image?: string | null;
          title?: string;
          uid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "map_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      marker: {
        Row: {
          address: string | null;
          avg_price: number | null;
          collection_id: string;
          color: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          icon: string | null;
          lat: number;
          lng: number;
          map_id: string;
          opening_times: string[] | null;
          phone: string | null;
          photos: Json | null;
          place_id: string | null;
          rating: number | null;
          reviews: Json | null;
          title: string;
          types: string[] | null;
          uid: string;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          avg_price?: number | null;
          collection_id: string;
          color?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          icon?: string | null;
          lat: number;
          lng: number;
          map_id: string;
          opening_times?: string[] | null;
          phone?: string | null;
          photos?: Json | null;
          place_id?: string | null;
          rating?: number | null;
          reviews?: Json | null;
          title: string;
          types?: string[] | null;
          uid?: string;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          avg_price?: number | null;
          collection_id?: string;
          color?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          icon?: string | null;
          lat?: number;
          lng?: number;
          map_id?: string;
          opening_times?: string[] | null;
          phone?: string | null;
          photos?: Json | null;
          place_id?: string | null;
          rating?: number | null;
          reviews?: Json | null;
          title?: string;
          types?: string[] | null;
          uid?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "marker_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collection";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "marker_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marker_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "map";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "marker_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "shared_map_view";
            referencedColumns: ["uid"];
          },
        ];
      };
      shared_map: {
        Row: {
          map_id: string;
          permission: Database["public"]["Enums"]["permission_level"];
          user_id: string;
        };
        Insert: {
          map_id: string;
          permission: Database["public"]["Enums"]["permission_level"];
          user_id: string;
        };
        Update: {
          map_id?: string;
          permission?: Database["public"]["Enums"]["permission_level"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shared_map_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "map";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "shared_map_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "shared_map_view";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "shared_map_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      shared_map_view: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          image: string | null;
          map_id: string | null;
          permission: Database["public"]["Enums"]["permission_level"] | null;
          title: string | null;
          uid: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "map_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shared_map_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "map";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "shared_map_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "shared_map_view";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "shared_map_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      permission_level: "viewer" | "editer" | "admin" | "owner";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
