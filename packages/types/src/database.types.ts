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
      form_responses: {
        Row: {
          created_at: string | null
          form_id: string
          id: string
          lead_email: string
          lead_name: string | null
          qualification_score: number | null
          qualification_status:
            | Database["public"]["Enums"]["qualification_status"]
            | null
          response_data: Json
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          form_id: string
          id?: string
          lead_email: string
          lead_name?: string | null
          qualification_score?: number | null
          qualification_status?:
            | Database["public"]["Enums"]["qualification_status"]
            | null
          response_data?: Json
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          form_id?: string
          id?: string
          lead_email?: string
          lead_name?: string | null
          qualification_score?: number | null
          qualification_status?:
            | Database["public"]["Enums"]["qualification_status"]
            | null
          response_data?: Json
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          form_fields: Json
          id: string
          is_active: boolean | null
          mailbox_id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean | null
          mailbox_id: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean | null
          mailbox_id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mailboxes: {
        Row: {
          created_at: string | null
          id: string
          owner_id: string
          processed_objective: string | null
          raw_objective: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner_id: string
          processed_objective?: string | null
          raw_objective?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          owner_id?: string
          processed_objective?: string | null
          raw_objective?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "mailboxes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          attendee_email: string
          attendee_name: string | null
          attendee_phone: string | null
          created_at: string | null
          duration_minutes: number | null
          form_response_id: string | null
          google_event_id: string | null
          id: string
          meeting_link: string | null
          meeting_title: string
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["meeting_status"] | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          attendee_email: string
          attendee_name?: string | null
          attendee_phone?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          form_response_id?: string | null
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          meeting_title: string
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["meeting_status"] | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attendee_email?: string
          attendee_name?: string | null
          attendee_phone?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          form_response_id?: string | null
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          meeting_title?: string
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["meeting_status"] | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          id: number
          message_id: string
          resource_id: string
          thread_id: string
        }
        Insert: {
          id?: number
          message_id: string
          resource_id: string
          thread_id: string
        }
        Update: {
          id?: number
          message_id?: string
          resource_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_attachments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_attachments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          direction: string
          from_email: string
          html_content: string | null
          id: string
          in_reply_to: string | null
          is_ai_generated: boolean | null
          message_id: string | null
          postmark_data: Json | null
          subject: string | null
          thread_id: string
          to_email: string
        }
        Insert: {
          content: string
          created_at?: string | null
          direction: string
          from_email: string
          html_content?: string | null
          id?: string
          in_reply_to?: string | null
          is_ai_generated?: boolean | null
          message_id?: string | null
          postmark_data?: Json | null
          subject?: string | null
          thread_id: string
          to_email: string
        }
        Update: {
          content?: string
          created_at?: string | null
          direction?: string
          from_email?: string
          html_content?: string | null
          id?: string
          in_reply_to?: string | null
          is_ai_generated?: boolean | null
          message_id?: string | null
          postmark_data?: Json | null
          subject?: string | null
          thread_id?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string | null
          file_path: string | null
          id: string
          mailbox_id: string
          name: string
          owner_id: string
          raw_content: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          id?: string
          mailbox_id: string
          name: string
          owner_id: string
          raw_content?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          id?: string
          mailbox_id?: string
          name?: string
          owner_id?: string
          raw_content?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          contact_email: string | null
          contact_metadata: Json | null
          contact_name: string | null
          created_at: string | null
          form_response_id: string | null
          id: string
          last_message_id: string | null
          last_updated: string | null
          mailbox_id: string | null
          namespace: string
          owner_id: string
          priority: string | null
          slug: string | null
          status: Database["public"]["Enums"]["thread_status"]
          subject: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_metadata?: Json | null
          contact_name?: string | null
          created_at?: string | null
          form_response_id?: string | null
          id?: string
          last_message_id?: string | null
          last_updated?: string | null
          mailbox_id?: string | null
          namespace: string
          owner_id: string
          priority?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["thread_status"]
          subject?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_metadata?: Json | null
          contact_name?: string | null
          created_at?: string | null
          form_response_id?: string | null
          id?: string
          last_message_id?: string | null
          last_updated?: string | null
          mailbox_id?: string | null
          namespace?: string
          owner_id?: string
          priority?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["thread_status"]
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_threads_form_response_id"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_threads_last_message_id"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      meeting_status:
        | "scheduled"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
      qualification_status:
        | "pending"
        | "qualifying"
        | "qualified"
        | "disqualified"
        | "meeting_booked"
      thread_status: "quarantined" | "active" | "closed" | "spam"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      meeting_status: [
        "scheduled",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
      ],
      qualification_status: [
        "pending",
        "qualifying",
        "qualified",
        "disqualified",
        "meeting_booked",
      ],
      thread_status: ["quarantined", "active", "closed", "spam"],
    },
  },
} as const
