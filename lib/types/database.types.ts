// Database types matching Supabase schema
// Auto-generated types for type-safe database queries

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          whatsapp_number: string | null
          avatar_url: string | null
          default_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone: string
          whatsapp_number?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          whatsapp_number?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          type: 'household' | 'trip' | 'event'
          description: string | null
          created_by: string
          whatsapp_group_link: string | null
          whatsapp_webhook_url: string | null
          is_archived: boolean
          created_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'household' | 'trip' | 'event'
          description?: string | null
          created_by: string
          whatsapp_group_link?: string | null
          whatsapp_webhook_url?: string | null
          is_archived?: boolean
          created_at?: string
          archived_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'household' | 'trip' | 'event'
          description?: string | null
          created_by?: string
          whatsapp_group_link?: string | null
          whatsapp_webhook_url?: string | null
          is_archived?: boolean
          created_at?: string
          archived_at?: string | null
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
          default_split_percentage: number | null
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
          default_split_percentage?: number | null
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
          default_split_percentage?: number | null
        }
      }
      expenses: {
        Row: {
          id: string
          group_id: string
          amount: number
          description: string
          category: string
          paid_by_user_id: string
          date: string
          created_by: string
          created_at: string
          updated_at: string
          is_recurring: boolean
          recurrence_rule: Json | null
          receipt_url: string | null
          is_deleted: boolean
        }
        Insert: {
          id?: string
          group_id: string
          amount: number
          description: string
          category: string
          paid_by_user_id: string
          date?: string
          created_by: string
          created_at?: string
          updated_at?: string
          is_recurring?: boolean
          recurrence_rule?: Json | null
          receipt_url?: string | null
          is_deleted?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          amount?: number
          description?: string
          category?: string
          paid_by_user_id?: string
          date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          is_recurring?: boolean
          recurrence_rule?: Json | null
          receipt_url?: string | null
          is_deleted?: boolean
        }
      }
      expense_splits: {
        Row: {
          id: string
          expense_id: string
          user_id: string
          amount_owed: number
          amount_settled: number
          is_fully_settled: boolean
        }
        Insert: {
          id?: string
          expense_id: string
          user_id: string
          amount_owed: number
          amount_settled?: number
          is_fully_settled?: boolean
        }
        Update: {
          id?: string
          expense_id?: string
          user_id?: string
          amount_owed?: number
          amount_settled?: number
          is_fully_settled?: boolean
        }
      }
      settlements: {
        Row: {
          id: string
          group_id: string
          from_user_id: string
          to_user_id: string
          amount: number
          payment_method: 'upi' | 'cash' | 'bank_transfer' | 'other'
          reference_id: string | null
          note: string | null
          settled_at: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          from_user_id: string
          to_user_id: string
          amount: number
          payment_method: 'upi' | 'cash' | 'bank_transfer' | 'other'
          reference_id?: string | null
          note?: string | null
          settled_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          from_user_id?: string
          to_user_id?: string
          amount?: number
          payment_method?: 'upi' | 'cash' | 'bank_transfer' | 'other'
          reference_id?: string | null
          note?: string | null
          settled_at?: string
          created_at?: string
        }
      }
      expense_history: {
        Row: {
          id: string
          expense_id: string
          action: 'created' | 'updated' | 'deleted'
          changed_by: string
          old_values: Json | null
          new_values: Json | null
          changes_summary: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          action: 'created' | 'updated' | 'deleted'
          changed_by: string
          old_values?: Json | null
          new_values?: Json | null
          changes_summary?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          action?: 'created' | 'updated' | 'deleted'
          changed_by?: string
          old_values?: Json | null
          new_values?: Json | null
          changes_summary?: string | null
          changed_at?: string
        }
      }
      activity_feed: {
        Row: {
          id: string
          group_id: string
          user_id: string
          action_type: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                       'settlement_made' | 'user_joined' | 'user_left' |
                       'group_created' | 'group_updated'
          entity_id: string | null
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          action_type: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                       'settlement_made' | 'user_joined' | 'user_left' |
                       'group_created' | 'group_updated'
          entity_id?: string | null
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          action_type?: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                        'settlement_made' | 'user_joined' | 'user_left' |
                        'group_created' | 'group_updated'
          entity_id?: string | null
          description?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          group_id: string | null
          type: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                'settlement_received' | 'settlement_reminder' |
                'group_invite' | 'member_joined'
          title: string
          content: string
          link: string | null
          is_read: boolean
          sent_to_email: boolean
          sent_to_whatsapp: boolean
          email_sent_at: string | null
          whatsapp_sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          group_id?: string | null
          type: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                'settlement_received' | 'settlement_reminder' |
                'group_invite' | 'member_joined'
          title: string
          content: string
          link?: string | null
          is_read?: boolean
          sent_to_email?: boolean
          sent_to_whatsapp?: boolean
          email_sent_at?: string | null
          whatsapp_sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          group_id?: string | null
          type?: 'expense_added' | 'expense_updated' | 'expense_deleted' |
                 'settlement_received' | 'settlement_reminder' |
                 'group_invite' | 'member_joined'
          title?: string
          content?: string
          link?: string | null
          is_read?: boolean
          sent_to_email?: boolean
          sent_to_whatsapp?: boolean
          email_sent_at?: string | null
          whatsapp_sent_at?: string | null
          created_at?: string
        }
      }
      group_invites: {
        Row: {
          id: string
          group_id: string
          invite_code: string
          created_by: string
          expires_at: string
          max_uses: number | null
          current_uses: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          invite_code: string
          created_by: string
          expires_at: string
          max_uses?: number | null
          current_uses?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          invite_code?: string
          created_by?: string
          expires_at?: string
          max_uses?: number | null
          current_uses?: number
          is_active?: boolean
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          whatsapp_notifications: boolean
          push_notifications: boolean
          notification_digest: boolean
          quiet_hours_start: string | null
          quiet_hours_end: string | null
          notification_types: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          whatsapp_notifications?: boolean
          push_notifications?: boolean
          notification_digest?: boolean
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          notification_types?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          whatsapp_notifications?: boolean
          push_notifications?: boolean
          notification_digest?: boolean
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          notification_types?: Json
          created_at?: string
          updated_at?: string
        }
      }
      monthly_expense_summary: {
        Row: {
          id: string
          group_id: string
          user_id: string
          month: string
          total_spent: number
          total_share: number
          net_contribution: number
          expenses_count: number
          settlements_made: number
          settlements_received: number
          category_breakdown: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          month: string
          total_spent?: number
          total_share?: number
          net_contribution?: number
          expenses_count?: number
          settlements_made?: number
          settlements_received?: number
          category_breakdown?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          month?: string
          total_spent?: number
          total_share?: number
          net_contribution?: number
          expenses_count?: number
          settlements_made?: number
          settlements_received?: number
          category_breakdown?: Json
          created_at?: string
          updated_at?: string
        }
      }
      balance_snapshots: {
        Row: {
          id: string
          group_id: string
          user_id: string
          other_user_id: string
          balance: number
          snapshot_date: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          other_user_id: string
          balance: number
          snapshot_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          other_user_id?: string
          balance?: number
          snapshot_date?: string
          created_at?: string
        }
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
  }
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for convenience
export type User = Tables<'users'>
export type Group = Tables<'groups'>
export type GroupMember = Tables<'group_members'>
export type Expense = Tables<'expenses'>
export type ExpenseSplit = Tables<'expense_splits'>
export type Settlement = Tables<'settlements'>
export type ExpenseHistory = Tables<'expense_history'>
export type ActivityFeed = Tables<'activity_feed'>
export type Notification = Tables<'notifications'>
export type GroupInvite = Tables<'group_invites'>
export type UserPreferences = Tables<'user_preferences'>
export type MonthlyExpenseSummary = Tables<'monthly_expense_summary'>
export type BalanceSnapshot = Tables<'balance_snapshots'>
